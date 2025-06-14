// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title 校园共享代币 (金融功能版)
 * @dev 在增强版的基础上，增加了用户直接购买代币和管理员管理资金的功能。
 * - DEFAULT_ADMIN_ROLE: 默认管理员，可以授予和撤销其他角色，以及设置汇率、提取ETH。
 * - MINTER_ROLE: 铸币者角色，只有该角色才能铸造新代币（用于奖励等非购买场景）。
 * - PAUSER_ROLE: 暂停者角色，可以在紧急情况下暂停/恢复代币的所有转账活动。
 */
contract CampusShareToken is ERC20, ERC20Burnable, AccessControl, Pausable {
    // --- 角色定义 ---
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // --- 经济模型 ---
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 最大供应量: 1亿
    uint256 public exchangeRate = 100; // 汇率: 1 ETH 可以购买 100 CST

    // --- 事件 ---
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event ExchangeRateUpdated(uint256 newRate);

    /**
     * @dev 构造函数，初始化代币、角色和固定的初始汇率。
     */
    constructor() ERC20("Campus Share Token", "CST") {
        // 授予部署者所有初始角色
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // 触发事件，记录初始汇率
        emit ExchangeRateUpdated(exchangeRate);
    }

    /**
     * @dev 允许用户通过发送ETH来购买CST代币。
     */
    function buyTokens() external payable whenNotPaused {
        require(msg.value > 0, "CST: Must send ETH to buy tokens");
        uint256 tokenAmount = (msg.value * exchangeRate) / 10**18;
        
        require(totalSupply() + tokenAmount <= MAX_SUPPLY, "CST: Would exceed max supply");
        
        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    /**
     * @dev 设置新的ETH兑换CST的汇率。
     * 只能由管理员调用。
     */
    function setExchangeRate(uint256 _newRate) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newRate > 0, "CST: Exchange rate must be greater than 0");
        exchangeRate = _newRate;
        emit ExchangeRateUpdated(_newRate);
    }

    /**
     * @dev 提取合约中积累的ETH。
     * 只能由管理员调用。
     */
    function withdrawETH() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "CST: No ETH to withdraw");
        
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "CST: ETH withdrawal failed");
    }

    /**
     * @dev 铸造新的代币（非购买场景，如平台奖励）。
     * 只能由拥有 MINTER_ROLE 角色的地址调用。
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "CST: Would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev 暂停代币转账。
     * 只能由拥有 PAUSER_ROLE 角色的地址调用。
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev 恢复代币转账。
     * 只能由拥有 PAUSER_ROLE 角色的地址调用。
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev OpenZeppelin 5.x 的内部更新函数，在任何代币转移时被调用。
     * 我们重写此函数，以确保在合约暂停时，所有转账都会失败。
     */
    function _update(address from, address to, uint256 value)
        internal
        whenNotPaused
        override
    {
        super._update(from, to, value);
    }

    /**
     * @dev 允许合约直接接收ETH（例如，通过直接转账）。
     */
    receive() external payable {}
}

// approve 函数是 ERC20 标准中的核心功能之一，它允许代币持有者授权其他地址代表自己花费一定数量的代币
// 然后调用transferfrom方法，进行转账。
// allowance 方法是用来查询授权额度的函数，它与 approve 方法配套使用。