# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased][unreleased]
### Fixed
- Change log hyperlinks

## [0.1.1] - 2015-01-28
### Changed
- Only attemt to slice when the number of columns are > 1. Else, either reset
to height 'auto' for 1 column or just process all items without slicing if
columns == 0.
- Optimized the script to only recalculate slices when the number of
columns changes rather than on each resize.

## [0.1.0] - 2015-01-22
### Added
- Initial release. All features added.

[unreleased]: https://github.com/gabesullice/samify.js/compare/0.1.1...HEAD
[0.1.1]: https://github.com/gabesullice/samify.js/compare/0.1.0...0.1.1
