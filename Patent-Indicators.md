# Patent Indicators

## JSON File Fields Data Dictionary

| JSON File Fields | Data Type | Sample Value | Definition |
|------------------|-----------|--------------|------------|
| **File_Metadata** | | | Meta data fields |
| Date_of_File_Generation | Date | 2022-03-31 00:00:00 | Date of generation of JSON file |
| Spec_Version_Number | String | Version 1 | JSON file version |
| **Portfolio_Indicators** | | | Meta data fields |
| CDMSID | Integer | 1439305 | InnoSpot Proprietary Unique company identifier |
| **Data** | | | Meta data fields |
| Year | Integer | 2021 | The year for which Point in Time (PIT) data is calculated |
| Month | Integer | 7 | The month for which Point in Time (PIT) data is calculated |
| **Indicators** | | | Meta data fields |
| Patent_Activity | Integer | 72315 | Count of application numbers that are tagged to the given company (based on current assignee) till the end of the given month and year. |
| Count_Grants_Cumulative | Integer | 47606 | Count of application numbers that are tagged to the given company and are granted till the given month and year. |
| Count_Pending_Applications | Integer | 24626 | Count of application numbers that are tagged to the given company (based on current assignee) and are not granted till the end of the given month and year. |
| Count_Disruptive_Themes_Grants | Integer | 15918 | Count of granted applications that are tagged to approved themes. |
| Patent_Growth | Float | 100 | Percentage increase in filing of patents by the company year-on-year or month-on-month based on user's request. |
| Count_Sites | Integer | 19 | Count of InnoSpot defined Industries in the company portfolio. |
| Count_Themes | Integer | 156 | Count of InnoSpot defined Themes in the company portfolio. |
| Count_Sectors | Integer | 335 | Count of InnoSpot defined Sector in the company portfolio. |
| Count_Simple_Families | Integer | 24744 | Count of simple families in the company portfolio. |
| Count_Inventors | Integer | 24896 | Count of inventors in the company portfolio. |
| Count_Applicants | Integer | 260 | Count of applicant's CDMSIDs in the company portfolio. |
| Count_Monthly_Publications | Integer | 300 | Count of application numbers that are tagged to the given company (based on current assignee) and are not granted till the end of the given month and year. |
| Count_Monthly_Filings | Integer | 500 | Count of application numbers that are tagged to the given company (based on current assignee) and are filed in the given month and year. |
| Count_Monthly_Grants | Integer | 100 | Count of application numbers that are tagged to the given company and are granted in the given month and year. |
| Dict_Portfolio_Applications_Forward | Dictionary | | This content segment contains numbers of a company that are cited by application numbers in "company portfolio" |
| Count_Cited_Companies | Integer | 11775 | Count of current assignee of the forward citations of all the application numbers of a given company (based on current portfolio). |
| Dict_Portfolio_Applications_Backward | Dictionary | | Count of applications numbers of a company that is citing application numbers in the "company portfolio" |
| Grant_Share | Float | 56.38 | Ratio of granted application numbers in a company portfolio to the patent activity of the company. |
| Count_CPC_Section | Integer | 9 | Count of sections (first character of CPC class) tagged to each application number in the portfolio. |
| Count_CPC_Subclass | Integer | 384 | Count of subclasses (first four characters of CPC class) tagged to each application number in the portfolio. |
| Technological_Scope | Integer | 2442 | Number of CPC class(Main Group Level) in each company of the company portfolio. |
| Average_Forward_Citation | Float | 0.57 | Ratio of count of unique forward citation application numbers to the count of unique application numbers in the portfolio. |
| Average_Backward_Citation | Float | 0.54 | Ratio of count of unique backward citation application numbers to the count of unique application numbers in the portfolio. |
| Count_Backward_Citations | Integer | 11645 | It is the unique count of backward citation application numbers if the company's portfolio. |
| Count_Forward_Citations | Integer | 12389 | It is the unique count of forward citation application numbers if the company's portfolio. |
| Forward_Appropriability | Float | 9.53 | Appropriability is the capacity of the firm to retain the added value it creates for its own benefit. However, who benefits from this added value depends on the decisions of the firm, the structure of the market in which it operates, and the sources of the added value itself. It is the percentage of self-citations in a company's forward citations. This metric indicates that the innovator (firm) is working on follow-up in-house developments on the original invention. Higher value suggests that, in-house development is more on the technology by the given company in comparison to the development by other innovators. This means that the innovator can reap higher appropriation. |
| Backward_Appropriability | Float | 9.53 | It is the percentage of self-citations in a company's backward citations. This metric indicates that the innovator (firm) is working on follow-up in-house developments on the original invention. Higher value suggests that, in-house development is more on the technology by the given company in comparison to the development by other innovators. This means that the innovator can reap higher appropriation. |
| Technology_Cycle_Time | Float | 9 | Mean age in years of the backward patent citations in the company's IP portfolio. |
| Patent_Growth_CAGR | Float | 3.41 | 3 Year CAGR of Patents of Current Portfolio |
| Global_Exploitation_IP | Integer | 38 | Number of Authorities of the granted patents in portfolio |
| Cooperation_Intensity | Integer | 591 | Number of joint patent applications with partners in a given portfolio |
| Count_Self_Forward_Citation | Integer | 1181 | Count of self forward citations |
| Count_Self_Backward_Citation | Integer | 1256 | Count of backward self-citations |
| Current_Impact_Index | Integer | 3 | The Current Impact Index preferably shows the impact of a company's patents on the latest technological developments. The CII is a measure of how often the previous five years of a company's patents are cited by patents issued in the most recent year, relative to all US patents. A CII of 1.0 shows that the last five years of a company's patents are cited as often as expected, compared to all U.S. patents. A CII of 1.1 indicates 10 percent more citations per patent than expected, and so forth. Note that CII is a synchronous indicator, and moves with the current year, looking back five years. As a result, when a company's patents from recent years start to drop in impact, this is reflected as a decline in the current year's CII. CII measures how often a particular company's patents are cited, compared with the average for the overall patent system. A company with high CII is regarded as being in a strong position technologically. A value of 1.0 represent average citation frequency. |
| Technology_Strength | Integer | 152793 | Quality-weighted portfolio size, defined as the number of patents multiplied by current impact index. Using Technology Strength you may find that although one company has more patents, a second may be technologically more powerful because its patents are of better quality. |
| Originality_Index | Float | 0.16 | Inventions relying on a large number of diverse knowledge sources are supposed to lead to original results. Larger the originality index, broader the technological roots of the underlying research. |
| Generality_Index | Float | 0.15 | Generality is a measure of dispersion of a patents knowledge through forward citations. It measures whether the patent is impacting or utility in localised sector or permeates to many sectors. Forward patent citations can be used to assess the range of later generations of inventions that have benefitted from a patent, by means of measuring the range of technology fields - and consequently industries - that cite the patent. |
| Last_Modified_Date | Date | 2021-11-06 00:00:00 | Date on which the PIT data was calculated/modified |