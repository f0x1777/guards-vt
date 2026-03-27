// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GuardedTreasuryVault {
    address public governance;
    address public operator;
    bool public paused;

    mapping(address => bool) public allowedAssets;
    mapping(address => bool) public allowedDestinations;
    mapping(address => uint256) public maxTransferAmount;

    event GovernanceTransferred(address indexed previousGovernance, address indexed nextGovernance);
    event OperatorUpdated(address indexed previousOperator, address indexed nextOperator);
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event AssetAllowed(address indexed asset, bool allowed);
    event DestinationAllowed(address indexed destination, bool allowed);
    event TransferLimitSet(address indexed asset, uint256 amount);
    event TreasuryTransfer(address indexed asset, address indexed destination, uint256 amount, bytes32 referenceId);
    event TreasuryWithdrawal(address indexed asset, address indexed destination, uint256 amount, bytes32 referenceId);

    error NotGovernance();
    error NotAuthorized();
    error VaultPaused();
    error AssetNotAllowed();
    error DestinationNotAllowed();
    error TransferLimitExceeded();
    error ZeroAddress();
    error ExecutionNotImplemented();

    constructor(address initialGovernance, address initialOperator) {
        if (initialGovernance == address(0) || initialOperator == address(0)) revert ZeroAddress();
        governance = initialGovernance;
        operator = initialOperator;
    }

    modifier onlyGovernance() {
        if (msg.sender != governance) revert NotGovernance();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != governance && msg.sender != operator) revert NotAuthorized();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert VaultPaused();
        _;
    }

    function transferGovernance(address nextGovernance) external onlyGovernance {
        if (nextGovernance == address(0)) revert ZeroAddress();
        address previous = governance;
        governance = nextGovernance;
        emit GovernanceTransferred(previous, nextGovernance);
    }

    function setOperator(address nextOperator) external onlyGovernance {
        if (nextOperator == address(0)) revert ZeroAddress();
        address previous = operator;
        operator = nextOperator;
        emit OperatorUpdated(previous, nextOperator);
    }

    function setPaused(bool nextPaused) external onlyGovernance {
        paused = nextPaused;
        if (nextPaused) emit Paused(msg.sender);
        else emit Unpaused(msg.sender);
    }

    function setAllowedAsset(address asset, bool allowed) external onlyGovernance {
        if (asset == address(0)) revert ZeroAddress();
        allowedAssets[asset] = allowed;
        emit AssetAllowed(asset, allowed);
    }

    function setAllowedDestination(address destination, bool allowed) external onlyGovernance {
        if (destination == address(0)) revert ZeroAddress();
        allowedDestinations[destination] = allowed;
        emit DestinationAllowed(destination, allowed);
    }

    function setMaxTransferAmount(address asset, uint256 amount) external onlyGovernance {
        if (asset == address(0)) revert ZeroAddress();
        maxTransferAmount[asset] = amount;
        emit TransferLimitSet(asset, amount);
    }

    function executeTransfer(address asset, address destination, uint256 amount, bytes32 referenceId)
        external
        view
        onlyAuthorized
        whenNotPaused
    {
        _validateOperation(asset, destination, amount);
        referenceId;
        revert ExecutionNotImplemented();
    }

    function executeWithdrawal(address asset, address destination, uint256 amount, bytes32 referenceId)
        external
        view
        onlyGovernance
        whenNotPaused
    {
        _validateOperation(asset, destination, amount);
        referenceId;
        revert ExecutionNotImplemented();
    }

    function _validateOperation(address asset, address destination, uint256 amount) internal view {
        if (!allowedAssets[asset]) revert AssetNotAllowed();
        if (!allowedDestinations[destination]) revert DestinationNotAllowed();
        uint256 limit = maxTransferAmount[asset];
        if (limit == 0 || amount > limit) revert TransferLimitExceeded();
    }
}
