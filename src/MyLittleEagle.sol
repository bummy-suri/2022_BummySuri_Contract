pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyLittleEagle is ERC721EnumerableUpgradeable {
    using Counters for Counters.Counter;
    using StringsUpgradeable for uint256;

    address[] public whiteList;
    mapping(address => bool) isWhiteListed;
    bool public isTransferBlocked;

    address public masterAdmin;
    uint256 public assetLimit;
    string public baseURIextended;
    bool public uriSet;
    Counters.Counter public _tokenIdCounter;

    modifier onlyMasterAdmin() {
        require(msg.sender == masterAdmin, "ContractError: CALLER_MUST_BE_MASTERADMIN");
        _;
    }

    modifier preMintChecker(address receiver) {
        require(uriSet == true, "ContractError: INVALID_BASE_URI_SET");
        require(isWhiteListed[msg.sender] == true, "ContractError: ACCESS_DENIED");
        require(msg.sender == masterAdmin || msg.sender == receiver, "ContractError: CALLER_IS_NOT_RECEIVER");
        require(totalSupply() + 1 <= assetLimit, "ContractError: ASSET_LIMIT");
        _;
    }

    modifier transferBlockChecker(address from) {
        require(isTransferBlocked == false || from == masterAdmin, "ContractError: TRANSFER_BLOCKED");
        _;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 assetLimit_
    ) external initializer {
        __ERC721_init(name_, symbol_);
        masterAdmin = msg.sender;
        whiteList.push(msg.sender);
        isWhiteListed[msg.sender] = true;
        assetLimit = assetLimit_;
        uriSet = false;
        isTransferBlocked = false;
    }

    // Metadata set
    function setBaseURI(string memory baseURI_) external onlyMasterAdmin {
        uriSet = true;
        baseURIextended = baseURI_;
    }

    // Emergency function
    function setMasterAdmin(address masterAdmin_) external onlyMasterAdmin {
        masterAdmin = masterAdmin_;
    }

    function setAssetLimit(uint256 assetLimit_) external onlyMasterAdmin {
        assetLimit = assetLimit_;
    }

    function setTransferBlock(bool isTransferBlocked_) external onlyMasterAdmin {
        isTransferBlocked = isTransferBlocked_;
    }

    // Set address to whitelist
    function setWhiteList(address user) external onlyMasterAdmin {
        require(isWhiteListed[user] == false, "ContractError: ALREADY_LISTED");
        whiteList.push(user);
        isWhiteListed[user] = true;
    }

    // Internal mint function
    function _singleMint(address receiver) internal {
        uint256 id = _tokenIdCounter.current();
        if (id == 0) {
            _tokenIdCounter.increment();
            id = _tokenIdCounter.current();
        }

        _safeMint(receiver, id);
        _tokenIdCounter.increment();
    }

    /// @notice 일반 유저가 민팅하는 함수
    /// @dev singleMint를 실행하여 Minting할 시, 유저가 직접 트랜잭션 요청을 보내는 경우 유저가 whiteList에 등록되어 있어야 한다.
    /// @param receiver: 민팅한 NFT를 전송할 주소
    function singleMint(address receiver) external preMintChecker(receiver) {
        _singleMint(receiver);

        // 마스터 어드민의 경우, 화이트리스트 권한을 유지해야 한다.
        if (msg.sender != masterAdmin) {
            // 화이트리스트에서 유저를 제거
            address[] memory whiteListLocal = whiteList;
            uint256 len = whiteListLocal.length;
            for (uint256 i = 0; i < len; i += 1) {
                if (whiteList[i] == receiver) {
                    whiteList[i] = whiteList[len - 1]; // i 번째 index를 마지막 index의 data로 변경 (i번째 삭제)
                    whiteList.pop(); // 마지막 index data 삭제 (i 번째 index에 이미 옮겨진 data)
                    break;
                }
            }
            isWhiteListed[receiver] = false;
        }
    }

    /// @notice 관리자 이머전시 민팅 함수
    /// @dev preMintChecker 제약조건을 무시하고, 민팅을 진행하는 이머전시 기능(일반적으로, 단일 민팅 시 SingleMint를 관리자가 실행한다.)
    /// @param receiver: 민팅한 NFT를 전송할 주소
    /// @param mintNum: receive에게 민팅할 수량
    function adminMint(address receiver, uint256 mintNum) external onlyMasterAdmin {
        for (uint256 i = 0; i < mintNum; i++) {
            _singleMint(receiver);
        }
    }

    // View function
    function supportsInterface(bytes4 interfaceId) public view override(ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    // internal function
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURIextended;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // 상속받은 Transfer 함수 - 정책에 따라 Transfer 여부 수정
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override transferBlockChecker(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override transferBlockChecker(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override transferBlockChecker(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
