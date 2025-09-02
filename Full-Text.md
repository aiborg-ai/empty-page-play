# Full Text

## JSON File Fields Data Dictionary

| JSON File Fields | Data Type | Sample Value | Comment |
|------------------|-----------|--------------|---------|
| **File_Metadata** | | | Meta data fields |
| Date_of_File_Generation | Date | 2022-03-31 00:00:00 | Date of generation of JSON file |
| Company Name | String | "Apple Inc" | Company name |
| **PatentsDescription** | | | Meta data fields |
| Publication_Number | String | US20220104154A1 | The number given to a patent by the patenting Authority once the patent is published after filing the patent application |
| Description | String | "FIELD This application relates generally to intelligent automated assistants and, more specifically, to modifying or sanitizing word predictions…" | The detailed description of the patent (Currently available for US and EP patents only) |
| Claims | String | "Claims": "&lt;table border='1'&gt;&lt;thead&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Claim&lt;/th&gt;&lt;/thead&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;CLM-00001&lt;/td&gt;&lt;td&gt;&lt;span&gt;1. A non-transitory computer-readable storage medium storing one or more programs, the one or more programs comprising instructions…" | The claims of a patent (Currently available for US only in API) |
| Abstract | String | Some embodiments of this disclosure include apparatuses and methods for determining synchronization signal.. | Abstract is part of the patent applications which describe about the invention. |