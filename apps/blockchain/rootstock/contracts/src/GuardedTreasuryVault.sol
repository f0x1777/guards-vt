// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract GuardedTreasuryVault {
    address public governance;
    address public operator;
    bool public paused;

    mapping(address => bool) public allowedAssets;
    mapping(address => bool) public allowedDestinations;
    mapping(address => uint256) public maxTransferAmount;
    mapping(bytes32 => bool) public usedReferenceIds;

    event GovernanceTransferred(address indexed previousGovernance, address indexed nextGovernance);
    event OperatorUpdated(address indexed previousOperator, address indexed nextOperator);
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event AssetAllowed(address indexed asset, bool allowed);
    event DestinationAllowed(address indexed destination, bool allowed);
    event TransferLimitSet(address indexed asset, uint256 amount);
    event TreasuryTransfer(address indexed asset, address indexed destination, uint256 amount, bytes32 referenceId);
    event TreasuryWithdrawal(address indexed asset, address indexed destination, uint256 amount, bytes32 referenceId);
    event NativeDeposit(address indexed account, uint256 amount);

    error NotGovernance();
    error NotAuthorized();
    error VaultPaused();
    error AssetNotAllowed();
    error DestinationNotAllowed();
    error TransferLimitExceeded();
    error ZeroAddress();
    error InvalidAmount();
    error DuplicateReferenceId();
    error NativeTransferFailed();
    error TokenTransferFailed();

    constructor(address initialGovernance, address initialOperator) {
        if (initialGovernance == address(0) || initialOperator == address(0)) revert ZeroAddress();
        governance = initialGovernance;
        operator = initialOperator;
    }

    receive() external payable {
        emit NativeDeposit(msg.sender, msg.value);
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
        allowedAssets[asset] = allowed;
        emit AssetAllowed(asset, allowed);
    }

    function setAllowedDestination(address destination, bool allowed) external onlyGovernance {
        if (destination == address(0)) revert ZeroAddress();
        allowedDestinations[destination] = allowed;
        emit DestinationAllowed(destination, allowed);
    }

    function setMaxTransferAmount(address asset, uint256 amount) external onlyGovernance {
        maxTransferAmount[asset] = amount;
        emit TransferLimitSet(asset, amount);
    }

    function executeTransfer(address asset, address destination, uint256 amount, bytes32 referenceId)
        external
        onlyAuthorized
        whenNotPaused
    {
        _executeOperation(asset, destination, amount, referenceId);
        emit TreasuryTransfer(asset, destination, amount, referenceId);
    }

    function executeWithdrawal(address asset, address destination, uint256 amount, bytes32 referenceId)
        external
        onlyGovernance
        whenNotPaused
    {
        _executeOperation(asset, destination, amount, referenceId);
        emit TreasuryWithdrawal(asset, destination, amount, referenceId);
    }

    function _executeOperation(address asset, address destination, uint256 amount, bytes32 referenceId) internal {
        if (usedReferenceIds[referenceId]) revert DuplicateReferenceId();
        usedReferenceIds[referenceId] = true;
        _validateOperation(asset, destination, amount);

        if (asset == address(0)) {
            (bool ok,) = destination.call{value: amount}("");
            if (!ok) revert NativeTransferFailed();
            return;
        }

        if (!_safeTransferToken(asset, destination, amount)) revert TokenTransferFailed();
    }

    function _validateOperation(address asset, address destination, uint256 amount) internal view {
        if (!allowedAssets[asset]) revert AssetNotAllowed();
        if (!allowedDestinations[destination]) revert DestinationNotAllowed();
        if (amount == 0) revert InvalidAmount();
        uint256 limit = maxTransferAmount[asset];
        if (limit == 0 || amount > limit) revert TransferLimitExceeded();
    }

    function _safeTransferToken(address asset, address destination, uint256 amount) internal returns (bool) {
        (bool success, bytes memory data) =
            asset.call(abi.encodeCall(IERC20Minimal.transfer, (destination, amount)));
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }
}
