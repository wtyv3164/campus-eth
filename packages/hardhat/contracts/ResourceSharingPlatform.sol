// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title 校园资源共享平台合约 (自动化结算版)
 * @dev 在可发现性版本上，增加了租赁时长和超时自动结算功能，解决了押金锁定风险。
 */
contract ResourceSharingPlatform is AccessControl, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.UintSet;

    // --- 角色与常量 ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant RENTAL_REWARD_AMOUNT = 10 * 10**18; // 每次成功租赁奖励10个CST

    // --- 枚举 ---
    enum ListingType { Free, ForRent, ForSale, RentAndSale }
    enum ResourceStatus { Pending, Available, Rented, Sold }

    // --- 结构体 ---
    struct Resource {
        uint256 id;
        string name;
        string ipfsImageHash;
        address owner;
        ListingType listingType; // 资源模式 (免费, 租赁, 出售, 租售一体)
        uint256 maxRentDuration; // **新增：最长租赁时长 (秒)**
        uint256 rentalPrice;     // 租赁价格 (CST)
        uint256 deposit;         // 租赁押金 (CST)
        uint256 salePrice;       // 出售价格 (CST)
        ResourceStatus status;
        address currentRenter;
    }

    struct RentalInfo {
        uint256 deposit;
        uint256 rentalPrice;
        address renter;
        bool active;
        uint256 expiresAt; // **新增：租赁到期时间戳**
    }

    // --- 状态变量 ---
    IERC20 public immutable cstToken;
    uint256 private _resourceIdCounter;
    mapping(uint256 => Resource) public resources;
    mapping(uint256 => RentalInfo) public rentals;
    EnumerableSet.UintSet private _availableResourceIds;

    // --- 事件 ---
    event ResourceListed(uint256 indexed resourceId, address indexed owner, ListingType listingType);
    event ResourceApproved(uint256 indexed resourceId, address indexed admin);
    event FreeResourceAcquired(uint256 indexed resourceId, address indexed acquirer);
    event ResourceRented(uint256 indexed resourceId, address indexed renter, uint256 expiresAt);
    event ResourceSold(uint256 indexed resourceId, address indexed buyer);
    event ResourceReturned(uint256 indexed resourceId, address indexed owner, address indexed renter);
    event RentalCancelled(uint256 indexed resourceId, address indexed renter);
    event RentalForceSettled(uint256 indexed resourceId, address indexed renter); // **新增：强制结算事件**
    event RewardDistributed(address indexed to, uint256 amount);

    /**
     * @dev 构造函数，初始化代币地址并授予部署者管理员权限
     */
    constructor(address _cstToken) {
        require(_cstToken != address(0), "Invalid token address");
        cstToken = IERC20(_cstToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev 发布新资源，需要指定资源模式和相应的价格。
     * 资源发布后状态为 'Pending'，等待管理员审核。
     */
    function listResource(
        string calldata _name,
        string calldata _ipfsImageHash,
        ListingType _listingType,
        uint256 _maxRentDuration,
        uint256 _rentalPrice,
        uint256 _deposit,
        uint256 _salePrice
    ) external {
        if (_listingType == ListingType.ForRent) {
            require(_rentalPrice > 0 && _deposit > 0 && _salePrice == 0 && _maxRentDuration > 0, unicode"租赁模式价格/时长设置错误");
        } else if (_listingType == ListingType.ForSale) {
            require(_salePrice > 0 && _rentalPrice == 0 && _deposit == 0, unicode"出售模式价格设置错误");
        } else if (_listingType == ListingType.RentAndSale) {
            require(_rentalPrice > 0 && _deposit > 0 && _salePrice > 0 && _maxRentDuration > 0, unicode"租售一体模式价格/时长设置错误");
        } else {
            require(_rentalPrice == 0 && _deposit == 0 && _salePrice == 0, unicode"免费模式不应设置价格");
        }

        uint256 newId = ++_resourceIdCounter;
        resources[newId] = Resource({
            id: newId,
            name: _name,
            ipfsImageHash: _ipfsImageHash,
            owner: msg.sender,
            listingType: _listingType,
            maxRentDuration: _maxRentDuration,
            rentalPrice: _rentalPrice,
            deposit: _deposit,
            salePrice: _salePrice,
            status: ResourceStatus.Pending,
            currentRenter: address(0)
        });
        emit ResourceListed(newId, msg.sender, _listingType);
    }

    /**
     * @dev 获取免费资源。任何人可调用，只触发事件，不改变资源状态。
     */
    function getFreeResource(uint256 resourceId) external {
        Resource storage res = resources[resourceId];
        require(res.status == ResourceStatus.Available, unicode"资源不可用");
        require(res.listingType == ListingType.Free, unicode"非免费资源");
        emit FreeResourceAcquired(resourceId, msg.sender);
    }

    /**
     * @dev 购买一个资源。成功后资金直接转给所有者，资源状态变为'Sold'。
     */
    function buyResource(uint256 resourceId) external nonReentrant {
        require(_availableResourceIds.contains(resourceId), unicode"资源当前不可购买或不存在");
        Resource storage res = resources[resourceId];
        require(res.status == ResourceStatus.Available, unicode"资源当前不可购买");
        require(res.listingType == ListingType.ForSale || res.listingType == ListingType.RentAndSale, unicode"该资源不出售");
        require(res.owner != msg.sender, unicode"不能购买自己的资源");

        uint256 price = res.salePrice;
        require(cstToken.balanceOf(msg.sender) >= price, unicode"CST余额不足");
        require(cstToken.allowance(msg.sender, address(this)) >= price, unicode"请先授权足够CST");

        require(cstToken.transferFrom(msg.sender, res.owner, price), unicode"购买支付失败");

        res.status = ResourceStatus.Sold;
        _availableResourceIds.remove(resourceId);
        emit ResourceSold(resourceId, msg.sender);
    }

    /**
     * @dev 租用一个资源，需要指定租赁时长。
     */
    function rentResource(uint256 resourceId, uint256 _rentDuration) external nonReentrant {
        require(_availableResourceIds.contains(resourceId), unicode"资源当前不可租赁或不存在");
        Resource storage res = resources[resourceId];
        require(res.status == ResourceStatus.Available, unicode"资源当前不可租赁");
        require(res.listingType == ListingType.ForRent || res.listingType == ListingType.RentAndSale, unicode"该资源不提供租赁");
        require(res.owner != msg.sender, unicode"不能租用自己的资源");
        require(_rentDuration > 0 && _rentDuration <= res.maxRentDuration, unicode"无效的租赁时长");

        uint256 totalCost = res.deposit + res.rentalPrice;
        require(cstToken.balanceOf(msg.sender) >= totalCost, unicode"CST余额不足");
        require(cstToken.allowance(msg.sender, address(this)) >= totalCost, unicode"请先授权足够CST");

        require(cstToken.transferFrom(msg.sender, address(this), totalCost), unicode"租赁支付失败");

        uint256 expiresAt = block.timestamp + _rentDuration;
        rentals[resourceId] = RentalInfo({ deposit: res.deposit, rentalPrice: res.rentalPrice, renter: msg.sender, active: true, expiresAt: expiresAt });
        res.status = ResourceStatus.Rented;
        res.currentRenter = msg.sender;
        _availableResourceIds.remove(resourceId);
        emit ResourceRented(resourceId, msg.sender, expiresAt);
    }
    
    /**
     * @dev 确认归还。由资源所有者调用，成功后平台将进行结算并分发奖励。
     */
    function confirmReturn(uint256 resourceId) external nonReentrant {
        _settleRental(resourceId, msg.sender);
    }

    /**
     * @dev 租客取消租赁。在归还未被确认前，租客可随时取消，押金和租金将全额退还。
     */
    function cancelRental(uint256 resourceId) external nonReentrant {
        Resource storage res = resources[resourceId];
        RentalInfo storage rental = rentals[resourceId];
        require(res.status == ResourceStatus.Rented, unicode"资源未被租用");
        require(res.currentRenter == msg.sender, unicode"只有当前租客可取消");
        require(rental.active, unicode"无有效租赁");

        uint256 totalCost = rental.deposit + rental.rentalPrice;
        require(cstToken.transfer(rental.renter, totalCost), unicode"退还失败");

        res.status = ResourceStatus.Available;
        res.currentRenter = address(0);
        rental.active = false;
        _availableResourceIds.add(resourceId);

        emit RentalCancelled(resourceId, msg.sender);
    }
    
    /**
     * @dev 租赁到期后，由租客调用以强制结算。
     */
    function forceSettleByRenter(uint256 resourceId) external nonReentrant {
        RentalInfo storage rental = rentals[resourceId];
        require(resources[resourceId].status == ResourceStatus.Rented, unicode"资源未被租用");
        require(rental.renter == msg.sender, unicode"只有当前租客可调用");
        require(block.timestamp >= rental.expiresAt, unicode"租赁尚未到期");
        
        _settleRental(resourceId, msg.sender);
        emit RentalForceSettled(resourceId, msg.sender);
    }

    // --- 管理员函数 ---

    /**
     * @dev 管理员审核资源，通过后资源变为 'Available' 可用状态。
     */
    function approveResource(uint256 resourceId) external onlyRole(ADMIN_ROLE) {
        Resource storage res = resources[resourceId];
        require(res.status == ResourceStatus.Pending, unicode"资源不是待审核状态");
        res.status = ResourceStatus.Available;
        _availableResourceIds.add(resourceId);
        emit ResourceApproved(resourceId, msg.sender);
    }

    /**
     * @dev 管理员下架一个 'Available' 状态的资源，使其回到 'Pending' 状态。
     */
    function setResourceUnavailable(uint256 resourceId) external onlyRole(ADMIN_ROLE) {
        require(_availableResourceIds.contains(resourceId), unicode"仅可下架可用资源");
        Resource storage res = resources[resourceId];
        res.status = ResourceStatus.Pending;
        _availableResourceIds.remove(resourceId);
    }

    // --- 查询函数 ---

    /**
     * @dev 获取当前所有可用资源的数量。
     */
    function getAvailableResourceCount() public view returns (uint256) {
        return _availableResourceIds.length();
    }

    /**
     * @dev 分页获取可用资源的ID列表。
     * @param startIndex 起始索引
     * @param count 要获取的数量
     * @return uint256[] 资源ID数组
     */
    function getAvailableResources(uint256 startIndex, uint256 count) public view returns (uint256[] memory) {
        uint256 total = _availableResourceIds.length();
        if (startIndex >= total) {
            return new uint256[](0);
        }
        uint256 endIndex = startIndex + count;
        if (endIndex > total) {
            endIndex = total;
        }
        
        uint256[] memory ids = new uint256[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            ids[i - startIndex] = _availableResourceIds.at(i);
        }
        return ids;
    }

    // --- 内部函数 ---
    
    /**
     * @dev 统一的租赁结算内部函数，处理资金转移和状态变更。
     */
    function _settleRental(uint256 resourceId, address initiator) internal {
        Resource storage res = resources[resourceId];
        RentalInfo storage rental = rentals[resourceId];
        
        // 如果是所有者发起的，调用者必须是所有者
        if (initiator == res.owner) {
            require(res.status == ResourceStatus.Rented, unicode"资源未被租用");
            require(rental.active, unicode"无有效租赁");
        }
        // 如果是租客发起的（强制结算），已在外部函数校验

        require(cstToken.transfer(res.owner, rental.rentalPrice), unicode"租金转账失败");
        require(cstToken.transfer(rental.renter, rental.deposit), unicode"押金退还失败");

        _distributeReward(res.owner);

        res.status = ResourceStatus.Available;
        res.currentRenter = address(0);
        rental.active = false;
        _availableResourceIds.add(resourceId);

        emit ResourceReturned(resourceId, res.owner, rental.renter);
    }
    
    /**
     * @dev 内部函数，用于分发奖励。它会通过低级别调用来执行代币合约的 mint 函数。
     * 前提：本平台合约的地址必须被授予代币合约的 MINTER_ROLE 角色。
     */
    function _distributeReward(address _to) internal {
        bytes4 selector = bytes4(keccak256("mint(address,uint256)"));
        (bool success, ) = address(cstToken).call(abi.encodeWithSelector(selector, _to, RENTAL_REWARD_AMOUNT));
        if (success) {
            emit RewardDistributed(_to, RENTAL_REWARD_AMOUNT);
        }
    }
} 