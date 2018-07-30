w3.includeHTML();
var table;
$(document).ready(function()
{
if(localStorage.getItem("Response"))
{
    setTimeout(function(){
        hygieneLeadSuccess(JSON.parse(localStorage.getItem("Response")));       
    },1000); 
}
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
    if(toDate < fromDate)
    {
        alert("From date should be before To date!");
        return false;
    }
    localStorage.setItem("FromDate", fromDate);
    localStorage.setItem("ToDate", toDate);
    

    // if(person == "")
    //     person=8856;
    // if(group == "")
    //     group=7598;

    var url = "http://Management.trakkerz.com/api/Reports/HygieneCheckForLeads";
    var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
    var values = [fromDate, toDate, person, group];

    var dataString = createJSON(params, values);

    //alert(dataString);
    ajaxCall(url, "POST", dataString, "application/json", hygieneLeadSuccess);		

});
function hygieneLeadSuccess(res)
{
    console.log(res);
    if(!!res.IsOk === true)
	{
        localStorage.setItem("Response",JSON.stringify(res));
        res = res.ResponseObject;
        var resp = JSON.stringify(res);
        localStorage.setItem("AllData", resp);
		var html = '';

		for(var i = 0; i < res.length; ++i)
		{
            var leadName = res[i].LeadName;
            var contactPerson = res[i].SchoolContactPerson;
            var contactNo = res[i].ContactNumber;
            var state = res[i].State;
            var city = res[i].City;
            var status = res[i].SPENDStatus;
            var schoolType = res[i].SchoolType;
            var schoolStrength = res[i].NoOfStudents;
            var designation = res[i].Designation;
            var email = res[i].EmailId;
            switch(status)
            {
                case 'S': 
                    status="Suspecting";
                    break;
                case 'P': 
                    status="Prospecting";
                    break;
                case 'E': 
                    status="Expecting";
                    break;
                case 'N': 
                    status="Not Done";
                    break;
                case 'D': 
                    status="Done";
                    break;
            }

            html += '<div>' +
                    '<tr class="small">' + 
						'<td>' + leadName + '</td>' + 
						'<td>' + contactPerson + '</td>' + 
                        '<td>' + contactNo + '</td>' + 
                        '<td>' + state + '</td>' +
                        '<td>' + city + '</td>' + 
                        '<td>' + status + '</td>' + 
                        '<td>' + schoolType + '</td>' + 
                        '<td>' + schoolStrength + '</td>' + 
                        '<td>' + designation  + '</td>' + 
                        '<td>' + email  + '</td>' +
                        '<td><a href="#" class="text-primary" id=' + "viewHygieneTable_" + res[i].LeadId + '>'+
						'View more' +
                        '</a>'+ 
                        '</td>'+
                    '</tr>' +
                    '</div>';
		}

        var tableData = '<table id="hygieneTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>'+
            '<tr>'+
                '<th>School Name</th>'+
                '<th>Contact Person</th>'+
                '<th>Contact No</th>'+
                '<th>State</th>'+
                '<th>City</th>' +
                '<th>Lead Status</th>' +
                '<th>School Type</th>' +                      
                '<th>Student Strength Range</th>' +
                '<th>Contact Person Designation</th>' + 
                '<th>Contact Person Email</th>' +
                '<th>Actions</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody id="hygieneTableRows">' +
        '</tbody>' +
        '</table>';
        $(".hygieneTableForLead").html(tableData);
        $("#hygieneTableRows").html(html);
        table = $('#hygieneTableReport').DataTable();
	}
	else
	{
        alert("Sorry, No Records found.");
        table.clear().draw();	
	}
}
});
$(document).on("click", "[id^='viewHygieneTable_']", function()
{
    var idForView = $(this).attr("id").split("_");
    // console.log("id is");
    // console.log(idForView);
    localStorage.setItem("IdForView", idForView[1]);
    // localStorage.setItem("FromDate", fromDate);
    // localStorage.setItem("ToDate", toDate);
    //alert(localStorage.getItem("IdForView"));
	window.location.href = "./hygieneTableView.html";
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