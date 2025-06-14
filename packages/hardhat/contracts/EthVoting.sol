//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract EthVoting {
    address public immutable owner;
    address public deployment; //合约地址
    //附议人信息
    struct Voter {
        uint voteTimeStamp; //投票时的区块时间
        bool initialized; //判断是否投过票的标志
    }

    //提案内容
    struct Proposal {
        string pName; //提案标题
        string pCtx; //提案内容
        address chairperson; //提案主持人
        uint voteCount; //附议人数
        bool initialized; //判断提案是否存在的标志
        uint limitTime; //附议限制时间
        mapping(address => Voter) voters; //附议列表
    }

    //所有提案列表
    mapping(uint => Proposal) public proposals;

    //附议事件
    event VoteEvt(string indexed eventType, address _voter, uint timestamp);

    //提案事件
    event ProposeEvt(string indexed eventType, uint _proposalId, uint _limitTime);

    constructor(address _owner, address _deployment) {
        owner = _owner;
        deployment = _deployment;
    }

    //创建新提案
    function createProposal(
        uint _pid,
        string memory _pName,
        string memory _pCtx,
        uint _limitTime
    ) public returns (uint) {
        uint pId = _pid;
        Proposal storage _proposal = proposals[pId];
        _proposal.pName = _pName;
        _proposal.pCtx = _pCtx;
        _proposal.chairperson = msg.sender;
        _proposal.initialized = true;
        _proposal.limitTime = _limitTime;
        _proposal.voteCount = 0;

        emit ProposeEvt("propose", pId, _limitTime);

        return pId;
    }

    //进行附议
    function doVoting(uint pId) public {
        //提案是否存在
        if (proposals[pId].initialized == false) revert("proposal not exist");

        uint currentTime = block.timestamp;

        //是否已超过提案时限
        if (proposals[pId].limitTime < currentTime) revert("exceed voting time");

        //是否已经投过票
        if (proposals[pId].voters[msg.sender].initialized == true) revert("already vote");

        //新投票信息
        Voter memory voter = Voter({ voteTimeStamp: block.timestamp, initialized: true });

        //记录投票信息
        proposals[pId].voters[msg.sender] = voter;
        proposals[pId].voteCount += 1;

        emit VoteEvt("vote", msg.sender, block.timestamp);
    }

    //查询是否附议
    function queryVoting(uint pId, address voterAddr) public view returns (uint) {
        //提案是否存在
        if (proposals[pId].initialized == false) revert("proposal not exist");

        //返回投票时间
        return proposals[pId].voters[voterAddr].voteTimeStamp;
    }

    //获取区块链时间
    function getBlockTime() public view returns (uint t) {
        t = block.timestamp;
    }

    //查询提案标题
    function getProposalName(uint pId) public view returns (string memory s) {
        s = proposals[pId].pName;
    }

    //查询提案内容
    function getProposalCtx(uint pId) public view returns (string memory s) {
        s = proposals[pId].pCtx;
    }

    //查询提案内容
    function getProposalVCnt(uint pId) public view returns (uint v) {
        v = proposals[pId].voteCount;
    }

    //查询提案期限
    function getProposalLimit(uint pId) public view returns (uint t) {
        t = proposals[pId].limitTime;
    }

    // 获取部署合约地址
    function getDeploymentAddress() public view returns (address) {
        return deployment;
    }
    
}
