# PIT Data

## JSON File Fields Data Dictionary

| JSON File Fields | Data Type | Sample Value | Comment |
|------------------|-----------|--------------|---------|
| **File_Metadata** | | | Meta data fields |
| Date_of_File_Generation | Date | 2022-03-31 00:00:00 | Date of generation of file |
| Spec_Version_Number | String | Version 1 | JSON file version |
| **Point_In_Time_Ownership_Data(PIT_Data)** | | | Meta data fields |
| Point-in-time_Execution_Date | Date | 2022-03-31 00:00:00 | The date on which either the patent is filed or reassigned, or a deal completed is announced. The point in time date is arranged from earliest to the newest/latest date based on the filing/assignment/execution/deal announce date |
| Application_Number | String | US14603007 | It is the number allocated by patent office to a patent when an applicant files a patent for their invention. |
| Application_Date | Date | 2015-01-22 00:00:00 | Also known as date of Filing, it is the date which the Patent Office acknowledges as the date you applied for a patent on your invention |
| Publication_Number | String | US20160092461A1 | The publication number is assigned when the patent application is published in the patent office journal(usually 18 months after it was filed). |
| Publication_Date | Date | 2016-03-31 00:00:00 | It is the data on which the patent is published in the patent office journal after the patent has been applied. |
| PIT_Assignee_Name | String | 3I GROUP PLC LONDON GB | The patent assignee name as per PIT assignee |
| PIT_Assignee_CDMSID | Integer | 1000080 | InnoSpot Proprietary Unique company identifier for PIT assignee |
| PIT_Reassignment/Portfolio | String | Reassignment; Portfolio | "Portfolio" indicates those patents which are directly filed by the company without reassigning at that point in time. "Reassignment" indicates those patents that have been assigned by the assignor from reassignment source records. |
| PIT_Recorded_Date | Date | 2000-01-12 00:00:00 | The reassignment date recorded in the patent office |
| Deal_Title | String | Apple Inc acquires regenerative medicine assets limited | Deal title which provide detials about the deals happened between which parties |
| Issuer_CDMSID | Integer | 1441748 | InnoSpot Proprietary Unique company identifier |
| Issuer_Company_Name | String | Regenerative Medicine Assets Limited (Inactive) | The company who issues the assets to the acquirer |
| Acquirer_CDMSID | Integer | 1439305 | InnoSpot Proprietary Unique company identifier |
| Acquirer_Company_Name | String | Apple Inc | The company who acquires the deal from another company after the deal is completed |
| Deal_Summary | String | Regenerative Medicine Assets Limited (Inactive)==>Apple Inc | It will provide the summary about the deals |