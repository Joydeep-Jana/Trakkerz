w3.includeHTML();

$(document).ready(function()
{
    var date= new Date;
    console.log(date);
    console.log(date.getDate());
    gatherGroups();
    $("#col2").on("click", "#btnSubmit", submited);
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    /*TZ-519 Aishwarya added this code to download csv */
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForConvertedLead");
        
		JSONToCSVConvertor(data, "ExcelDownloadForConvertedLead", true);
    });
    $("#convertedLeadTable").dataTable();
});
function _convertDate(str)
{
    var date = new Date(str);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dd = date.getDate();
	var mm = months[date.getMonth()];
    var yyyy = date.getFullYear();
    
	return dd + "/" + mm + "/" + yyyy;
}

function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/NewLeads";
    var fromDate = $("#selFromDate").val();
    var toDate = $("#selToDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    if(fromDate == "")
    {
        alert("Please select From date");
        return;
    }
    if(toDate == "")
    {
        alert("Please select To date");
        return;
    }
    if(group == 0)
    {
        // alert("Please select a group");
        // return;
        group = null;
    }
    if(personId == 0)
    {
        // alert("Please select a person");
        // return;
        personId = null;
    }
    var params = ["FromDate","ToDate", "PersonId", "GroupId"];
    var values = [fromDate,toDate, group, personId];
    var dataString = createJSON(params,values);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}
function submitedResponse(res)
{
    if(res.IsOk)
    {
        var dataArray = new Array();
        var mainData = res.ResponseObject;
        /*TZ-519 Aishwarya added this code to download csv */
        var excelDownload=[];
        for(var index=0; index<mainData.length; index++)
        {
            var temp = new Array();
            temp.push(mainData[index].LeadId);
            temp.push(mainData[index].LeadCreator);
            temp.push(mainData[index].LeadName);
            temp.push(mainData[index].ContactNumber);
            temp.push(mainData[index].NextAppointmentDate);
            /*TZ-519 Aishwarya added this code to download csv */
            var nextDate = mainData[index].NextAppointmentDate;
            if(nextDate!="")
                nextDate= _convertDate(nextDate);
            temp.push(mainData[index].SchoolContactPerson);
            temp.push(mainData[index].State);
            temp.push(mainData[index].City);
            temp.push(mainData[index].Address);
            temp.push(mainData[index].Remarks);
            dataArray.push(temp);
            /*TZ-519 Aishwarya added this code to download csv */
            var innerDetails = {};
            innerDetails["School_Id"] = mainData[index].LeadId;
            innerDetails["Lead_creator"] = mainData[index].LeadCreator;
            innerDetails["School_name"] = mainData[index].LeadName;
            innerDetails["Contact_no"] = mainData[index].ContactNumber;
            innerDetails["Next_appointment_date"] = nextDate;
            innerDetails["School_contact_person"] = mainData[index].SchoolContactPerson;
            innerDetails["State"] = mainData[index].State;
            innerDetails["City"] = mainData[index].City;
            innerDetails["Address"] = mainData[index].Address;
            innerDetails["Remarks"] = mainData[index].Remarks;
            excelDownload[excelDownload.length]=innerDetails;
        }
        var tableHtml = '<table id="convertedLeadTable" class="table table-striped table-bordered">'+
        '<thead>'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Creator</th>'+
                '<th>Lead Name</th>'+
                '<th>Contact No.</th>'+
                '<th>Next Appoinment Date</th>'+
                '<th>School Contact Person</th>'+
                '<th>State</th>'+
                '<th>City</th>'+
                '<th>Address</th>'+
                '<th>Remark</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'+
        '</body>'+
        '</table>';
        /*TZ-519 Aishwarya added this code to download csv */
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';  
        $("#downloadExcel").html(downloadButton);
        $(".tableForLead").html(tableHtml);
        $("#convertedLeadTable").dataTable(
            {
                destroy:true,
                data:dataArray
            }
        );
        /*TZ-519 Aishwarya added this code to download csv */
        localStorage.setItem("ExcelDownloadForConvertedLead",JSON.stringify(excelDownload));
            
    }
    else
    {
        alert(res.Message);
    }
}

function gatherGroups()
{
    var url = "http://trakkerz.trakkerz.com/api/Groups/GetGroupsByOrganizationId";
    var dataString = {"OrganizationId":1};
    dataString = JSON.stringify(dataString);
    ajaxCall(url, "POST", dataString, "application/json", function(res)
    {
        var data = res.ResponseObject;
        html = "<option value=0 >Select Group</option>";
        for(var index=0; index<data.length; index++)
        {
            var name = data[index].GroupName;
            if(name.length>27)
            {
                name = name.substring(0, 27) + "...";
            }
            html += "<option value='" + data[index].GroupId + "'>" + name + "</option>";
        }
        $("#formControlSelectGroup").html(html);
    });
}
function groupChanged()
{
    if(this.value != "" && this.value != "Select Group")
    {
        var url = "http://trakkerz.trakkerz.com/api/Groups/GetMembersByGroupId";
        var dataString = "{'GroupId':" + this.value + "}";
        ajaxCall(url, "POST", dataString, "application/json", function(res){
            var data = res.ResponseObject;
            var html = "<option>Select Person</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].PersonId + "'>" + data[index].FirstName + " " + data[index].LastName + "</option>";
            }
            $("#formControlSelectPerson").html(html);
        });
    }
    else
    {
        alert("Please Select a valid Group.");
    }
}