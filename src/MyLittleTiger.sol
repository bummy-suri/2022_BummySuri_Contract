pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyLittleTiger is ERC721EnumerableUpgradeable {
    using Counters for Counters.Counter;
    using StringsUpgradeable for uint256;

    address public masterAdmin;
    uint256 public assetLimit;
    string public baseURIextended;
    bool public uriSet;
    Counters.Counter public _tokenIdCounter;

    modifier onlyMasterAdmin() {
        require(msg.sender == masterAdmin, "MLTContract: CALLER_MUST_BE_MASTERADMIN");
        _;
    }

    modifier preMintChecker(uint256 _numAssets) {
        require(uriSet == true, "MLTContract: INVALID_BASE_URI_SET");
        require(totalSupply() + _numAssets <= assetLimit, "MLTContract: ASSET_LIMIT");
        _;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        uint256 assetLimit_
    ) external initializer {
        // TODO: name_, symbol_ 수정
        __ERC721_init(name_, symbol_);
        masterAdmin = msg.sender;
        assetLimit = assetLimit_;
        uriSet = true;
        baseURIextended = baseURI_;
    }

    // Emergency function
    function setMasterAdmin(address masterAdmin_) external onlyMasterAdmin {
        masterAdmin = masterAdmin_;
    }

    function setBaseURI(string memory baseURI_) external onlyMasterAdmin {
        uriSet = true;
        baseURIextended = baseURI_;
    }

    // Mint function
    function singleMint(address receiver) public preMintChecker(1) onlyMasterAdmin {
        uint256 id = _tokenIdCounter.current();
        if (id == 0) {
            _tokenIdCounter.increment();
            id = _tokenIdCounter.current();
        }

        _safeMint(receiver, id);
        _tokenIdCounter.increment();
    }

    function multipleMint(address receiver, uint256 numAssets) external preMintChecker(numAssets) onlyMasterAdmin {
        for (uint256 i = 0; i < numAssets; i++) {
            singleMint(receiver);
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
}
