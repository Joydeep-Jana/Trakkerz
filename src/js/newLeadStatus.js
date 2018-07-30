w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);

$(document).on("click", "#btnSubmit", function()
{
    //console.log("Clicked");
    var fromDate = $("#selFromDate").val();
    var toDate = $("#selToDate").val();
    var person = $("#formControlSelectPerson").val();
    var group  = $("#formControlSelectGroup").val();

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

    // if(person == "")
    //     person=8856;
    // if(group == "")
    //     group=7598;

    var url = "http://management.trakkerz.com/api/Reports/NewLeads";
    var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
    var values = [fromDate, toDate, person, group];

    var dataString = createJSON(params, values);

    //alert(dataString);
    ajaxCall(url, "POST", dataString, "application/json", newLeadSuccess);		

});
function newLeadSuccess(res)
{
    console.log(res);
    if(!!res.IsOk === true)
	{
		res = res.ResponseObject;
		var html = '';

		for(var i = 0; i < res.length; ++i)
		{
			var contactNo = res[i].ContactNumber;
			var address = res[i].Address;
			var leadCreator = res[i].LeadCreator;
			var leadId = res[i].LeadId;
			var leadName = res[i].LeadName;
			var contactPerson = res[i].SchoolContactPerson;
            var city = res[i].City;
            var state = res[i].State;
            var nextAppointment = res[i].NextAppointmentDate;
            var spendStatus = res[i].SPENDStatus;
            var remarks = res[i].Remarks;
            switch(spendStatus)
            {
                case 'S': 
                    spendStatus="Suspecting";
                    break;
                case 'P': 
                    spendStatus="Prospecting";
                    break;
                case 'E': 
                    spendStatus="Expecting";
                    break;
                case 'N': 
                    spendStatus="Not Done";
                    break;
                case 'D': 
                    spendStatus="Done";
                    break;
            }

            html += '<div>' +
                    '<tr class="small">' + 
                        '<td>' + leadName + '</td>' + 
                        '<td>' + contactPerson + '</td>' +
                        '<td>' + contactNo + '</td>' + 
                        '<td>' + state + '</td>' +
                        '<td>' + city + '</td>' +
                        '<td>' + leadCreator + '</td>' +
                        '<td>' + spendStatus  + '</td>' + 
                        '<td>' + nextAppointment  + '</td>' + 
                        '<td>' + remarks  + '</td>' +   
                    '</tr>' +
                    '</div>';
        }
        var tableData = '<table id="newLeadTableReport" class="table table-striped table-bordered table-responsive" style="width:100%">'+
        '<thead>' +
        '<tr>' +   
            '<th>School Name</th>' +                  
            '<th>Contact Person</th>' +
            '<th>Contact Number</th>' + 
            '<th>State</th>' +
            '<th>City</th>' +
            '<th>Lead Creator</th>' +
            '<th>Lead Status</th>' + 
            '<th>Next appointment Date</th>' + 
            '<th>Feedback</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="newLeadTableRows">' +
        '</tbody>' +
        '</table>';
        $(".newTableForLead").html(tableData);

		$("#newLeadTableRows").html(html);
		$('#newLeadTableReport').DataTable(); 
	}
	else
	{
		$("#leadTableRows").html("Sorry, No Records found.");	
	}
}
});
function gatherGroups()
{
    var url = "http://trakkerz.trakkerz.com/api/Groups/GetGroupsByOrganizationId";
    var dataString = {"OrganizationId":1};
    dataString = JSON.stringify(dataString);
    ajaxCall(url, "POST", dataString, "application/json", function(res)
    {
        console.log(res);
        var data = res.ResponseObject;
        html = "<option value=0 >Select Group</option>";
        for(var index=0; index<data.length; index++)
        {
            var name = data[index].GroupName;
            if(name.length>30)
            {
                console.log("hit");
                name = name.substring(0, 30) + "...";
                console.log(name);
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