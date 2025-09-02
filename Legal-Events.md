# Legal Events

## JSON File Fields Data Dictionary

| JSON File Fields | Data Type | Sample Value | Comment |
|------------------|-----------|--------------|---------|
| **File_Metadata** | | | Meta data fields |
| Date_of_File_Generation | Date | 2022-03-31 00:00:00 | Date of generation of JSON file |
| Spec_Version_Number | String | Version 1 | JSON file version |
| CDMSID | Integer | 1439305 | InnoSpot Proprietary Unique company identifier |
| **Bibliographic_Data** | | | Meta data fields |
| File_Type | String | Create | Details about kind of file "Create" or "Merge" or "Amend" |
| RDSource | String | EPO | The raw data source of the patent obtained from USPTO or EPO DocDB database |
| Document_Type | String | Grant | Details about type of document "Application" or "Grant" |
| IP_Type | String | Utility | Details about the type of document "Utility" or "Design" |
| Creation_Date | Date | 2022-03-31 00:00:00 | The creation date is the date when a patent is updated first time/entry created in database |
| Title | String | SYNCHRONIZATION SIGNAL BLOCK PERIODICITY FOR CELL RESELECTION | Title of the patent is the description which briefs about the content of the invention |
| **Publication_Reference** | | | Meta data fields |
| Publication_Number | String | US20220104154A1 | The number given to a patent by the patenting Authority once the patent is published after filing the patent application |
| Publication_Date | Date | 2022-03-31 00:00:00 | The date marks the date on which the patent application is available publicly. This usually happens after 18 months from the filing date. |
| Grant_Date | Date | 2022-03-31 00:00:00 | The date on which the patents is issued/granted by the patent authority for the patent application |
| **Application_Reference** | | | Meta data fields |
| Application_Number | String | US17427165 | The number given to a patent once the patent is published after filing the patent application |
| Application_Date | Date | 43874 | The date on which the application, which contain a disclosure of the invention is submitted in patent office |
| **Priority_Reference** | | | Meta data fields |
| Earliest_Priority_Date | Date | 2020-13-02 | The earliest priority date in patents is the earliest date for filing patent application within the family of patents. |
| Priority_Number | String | US17427165 | The priority number is the number of the application in respect of which priority is claimed, i.e. it is the same as the application number of the claimed priority document. |
| Priority_Date | Date | 2020-13-02 | The initial date by which the application is filed in the domestic patent office. The date is relevant to determine the novelty of an invention |
| **Notifications** | | | Meta data fields |
| Event_code | String | FA | Legal event code provide by office |
| Event_date | String | 2020-13-02 | Date on which legal event occurred in the document |
| Event_date_effective | Date | 2020-10-01 00:00:00 | Legal changes will effected from which date as the event code |
| Country | String | AR | Legal event code provide by with authority |
| Event_description | String | ABANDONMENT OR WITHDRAWAL | Event code meaning in one or two words |
| **Legal_Status** | | | Meta data fields |
| Event_code | String | FA | Legal event code provide by office |
| Status_code | String | B | Status code assigned by InnoSpot based on event code of each authority |
| Status_code_description | String | APPLICATION DISCONTINUED | Status code meaning in one or two words |
| **Life_State** | | | Meta data fields |
| State | String | Active | Based on the latest legal event global data provide tag to the patent is Active, Inactive, or Terminated |