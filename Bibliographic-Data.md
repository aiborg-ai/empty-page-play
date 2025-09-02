# Bibliographic Data

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
| Application_Date | Date | 2020-02-13 00:00:00 | The date on which the application, which contain a disclosure of the invention is submitted in patent office |
| **Priority_Reference** | | | Meta data fields |
| Earliest_Priority_Date | Date | 2020-13-02 | The earliest priority date in patents is the earliest date for filing patent application within the family of patents. |
| Priority_Number | String | US17427165 | The priority number is the number of the application in respect of which priority is claimed, i.e. it is the same as the application number of the claimed priority document. |
| Priority_Date | Date | 2020-13-02 | The initial date by which the application is filed in the domestic patent office. The date is relevant to determine the novelty of an invention |
| **Classifications** | | | Meta data fields |
| **CPCclassification** | | | Meta data fields |
| ClassificationText | String | H04W56/001 | The CPC classification code in the patent application |
| **IPCclassification** | | | Meta data fields |
| ClassificationText | String | H04W56/00 | The IPC classification code in the patent application |
| **Inventors** | | | Meta data fields |
| Inventor | String | Qian Li | The name of the inventor(s) in the patent application |
| **Applicants** | | | Meta data fields |
| Applicant_Name | String | Beats Electronics LLC | The patent Applicant as provided in the patent Bibliographic data |
| Applicant_Type | String | Organization | It will provide a indication like applicant is organization or individual |
| **Assignees** | | | Meta data fields |
| **Original_Assignee** | | | Meta data fields |
| Assignee_Name | Integer | Apple Inc | Organization/s and individual/s that have an ownership in the early stage of patent |
| Assignee_Role | Integer | 2 | It will provide a indication like applicant is organization or individual |
| Address_City | String | Los Angeles | Address of original assignee - City name |
| Address_State | String | California | Address of original assignee - State name |
| Address_Country | String | US | Address of original assignee - Country code |
| Original_CDMSID | String | 1439305 | InnoSpot proprietary identity number given for a company |
| **Current_Assignee** | | | Meta data fields |
| Current_Assignee | Integer | Apple Inc | The current assignee company name for the patent |
| Current_Assignee_CDMSID | String | 1439305 | InnoSpot proprietary identity number given for a company |
| Simple_Family_ID | String | 83465945 | The ID as provided by EPO DocDB database for a patent family |
| **Taggings** | | | Meta data fields |
| **Sites** | | | Meta data fields |
| SiteName | String | Emerging Technology Intelligence Center | Name of site/s the patent got tagged based on logic developed by InnoSpot |
| **Themes** | | | Meta data fields |
| ThemeName | String | Fuel Cells | InnoSpot proprietary theme |
| ThemeFullName | String | Industry - Defense - Fuel Cells | InnoSpot proprietary theme taxonomy |
| **Sectors** | | | Meta data fields |
| SectorName | String | Telecom Infrastructure | InnoSpot proprietary sectors tagged to a patent |
| SectorFullName | String | Technology - Telecom Infrastructure | InnoSpot proprietary sectors taxonomy |