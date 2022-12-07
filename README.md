# Google Drive and Apps Script examples

## Google Sheets

### Currency conversion at given date
- `=IF(ISERROR(IF(D415 = I$1,1,INDEX(GOOGLEFINANCE(D415&I$1,"price",A415),2,2))*C415),C415,IF(D415 = I$1,1,INDEX(GOOGLEFINANCE(D415&I$1,"price",A415),2,2))*C415)`
    - `D415` refers to the target currency code (e.g. `AUD`)
    - `A415` refers to the original date
    - `C415` refers to the value we’re converting
