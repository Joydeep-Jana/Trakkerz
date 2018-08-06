/*TZ-511 Aishwarya added Reports for Status of Expected Leads*/
w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForExpectedLead");
        
		JSONToCSVConvertor(data, "ExcelDownloadForExpectedLead", true);
	});
});

$(document).on("click", "#btnSubmit", function()
{
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var person = $("#formControlSelectPerson").val();
    var group  = $("#formControlSelectGroup").val();
    var status  = $("#formControlSelectStatus").val();
    switch(status)
    {
        case "Suspecting": 
        status="S";
        break;
        case "Prospecting": 
        status="E";
        break;
        case "Expecting": 
        status="E";
        break;
        case "Not Done": 
        status="N";
        break;
        case "Done": 
        status="D";
        break;
    }
    if(fromDate == "")
    {
        alert("Please enter From Date");
        return false;
    }
    if(toDate == "")
    {
        alert("Please enter To Date");
        return false;
    }
    if(toDate < fromDate)
    {
        alert("From date should be before To date!");
        return false;
    }
    
    if(person == "")
    person=8856;
    if(group == "")
    group=7598;
    
    var url = "https://management.trakkerz.com/api/Reports/LeadBySPENDStaus";
    var params = ["FromDate", "ToDate", "PersonId", "GroupId","SPENDStatus"];
    var values = [fromDate, toDate, person, group,status];
    
    var dataString = createJSON(params, values);
    
    ajaxCall(url, "POST", dataString, "application/json", expectedActivitySuccess);		
    
});
function expectedActivitySuccess(res)
{
    if(!!res.IsOk === true)
	{
		res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var city = res[i].City;
			var contactNumber = res[i].ContactNumber;
			var exceutiveName = res[i].ExceutiveName;
			var leadAddress = res[i].LeadAddress;
			var leadName = res[i].LeadName;
			var nextAppointmentDate = res[i].NextAppointmentDate;
            var schoolContactPerson = res[i].SchoolContactPerson;
            var state = res[i].State;
            
            var innerDetails = {};
            innerDetails["School_name"] = leadName;
            innerDetails["School_address"] = leadAddress;
            innerDetails["Executive_name"] = exceutiveName;
            innerDetails["School_contact_person"] = schoolContactPerson;
            innerDetails["Contact_number"] = contactNumber;
            innerDetails["Next_appointment_date"] = nextAppointmentDate;
            innerDetails["City"] = city;
            innerDetails["State"] = state;
            
            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr>' + 
            '<td>' + leadName + '</td>' + 
            '<td>' + leadAddress + '</td>' +
            '<td>' + exceutiveName + '</td>' + 
            '<td>' + schoolContactPerson + '</td>' +
            '<td>' + contactNumber + '</td>' +
            '<td>' + nextAppointmentDate + '</td>' +
            '<td>' + city  + '</td>' + 
            '<td>' + state  + '</td>' + 
            '</tr>' +
            '</div>';
        }
        var tableData = '<table id="expectedActivityTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +   
        '<th>School Name</th>' +                  
        '<th>School Address</th>' +
        '<th>Executive Name</th>' + 
        '<th>School Contact Person</th>' +
        '<th>Contact Number</th>' +
        '<th>Next Appointment Date</th>' +
        '<th>City</th>' + 
        '<th>State</th>' + 
        '</tr>' +
        '</thead>' +
        '<tbody id="expectedActivityTableRows">' +
        '</tbody>' +
        '</table>';
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
		$("#downloadExcel").html(downloadButton);
        $(".expectedActivityForLead").html(tableData);
        $("#expectedActivityTableRows").html(html);
        $('#expectedActivityTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForExpectedLead",JSON.stringify(excelDownload));
	}
	else
	{
        alert("Sorry, No Records found.");
		$("#expectedActivityTableRows").html("Sorry, No Records found.");	
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
            if(name.length>30)
            {
                name = name.substring(0, 30) + "...";
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