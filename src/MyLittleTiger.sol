pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyLittleTiger is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    address public masterAdmin;
    uint256 public ASSET_LIMIT = 3000;
    // QmQbKyKvQvAUnY9cpfVPFHcpwVs7Vo2kiJ4ffsHpmY1mt7
    string private _baseURIextended;
    bool internal uriSet;
    Counters.Counter private _tokenIdCounter;

    modifier onlyMasterAdmin() {
        require(msg.sender == masterAdmin, "MLTContract: CALLER_MUST_BE_MASTERADMIN");
        _;
    }

    // TODO: name, symbol 수정
    constructor() ERC721("TEMPNAME", "TEMPSYMBOL") {}

    // TODO: upgradeable로 수정
    function initialize(string memory baseURI_) external {
        masterAdmin = msg.sender;
        _baseURLextended = baseURI_;
    }

    function setMasterAdmin(address masterAdmin_) external onlyMasterAdmin {
        masterAdmin = masterAdmin_;
    }

    function setBaseURI(string memory baseURI_) external onlyMasterAdmin {
        uriSet = true;
        _baseURIextended = baseURI_;
    }

    function giveaway(address receiver, uint256 numAssets) external onlyMasterAdmin {
        require(uriSet == true, "MLTContract: INVALID_BASE_URI_SET");
        require(totalSupply() + numAssets <= ASSET_LIMIT, "MLTContract: ASSET_LIMIT");

        for (uint256 i = 0; i < numAssets; i++) {
            uint256 id;
            id = _tokenIdCounter.current();

            // start edition at #1 vs #0
            if (id == 0) {
                _tokenIdCounter.increment();
                id = _tokenIdCounter.current();
            }

            _safeMint(receiver, id);
            _tokenIdCounter.increment();
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // used by inherited 'function tokenURI'
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
