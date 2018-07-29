w3.includeHTML();
$(document).ready(function()
{
    $('#leadTableReport').DataTable();
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

        if(person == "")
            person=8856;
        if(group == "")
            group=7598;

        var url = "http://Management.trakkerz.com/api/Reports/ConvertedLeadsStatus";
        var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
        var values = [fromDate, toDate, person, group];

        var dataString = createJSON(params, values);

        //alert(dataString);
        ajaxCall(url, "POST", dataString, "application/json", verifiedLeadSuccess);		

    });
    function verifiedLeadSuccess(res)
    {
        console.log(res);
        if(res.IsOk)
        {
            res = res.ResponseObject;
            var html = '';

            for(var i = 0; i < res.length; ++i)
            {
                var contactNo = res[i].ContactNumber;
                var executiveName = res[i].ExceutiveName;
                var leadAddress = res[i].LeadAddress;
                var leadId = res[i].LeadId;
                var leadName = res[i].LeadName;
                var contactPerson = res[i].SchoolContactPerson;
                var schoolSetup = res[i].SchoolSetup;
                var city = res[i].City;
                var state = res[i].State;
                var setupStatusImg = "";
                if(schoolSetup)
                {
                    setupStatusIcon = "fa-remove text-danger"
                }
                else
                {
                    setupStatusIcon = "fa-check text-success";
                }

                html += '<div>' +
                        '<tr class="small">' +  
                            '<td>' + leadName + '</td>' + 
                            '<td>' + leadAddress + '</td>' + 
                            '<td>' + contactPerson + '</td>' +  
                            '<td>' + contactNo + '</td>' + 
                            '<td class="text-center"><i class="fa ' + setupStatusIcon + ' fa-2x"</td>' + 
                            '<td>' + city + '</td>' + 
                            '<td>' + state + '</td>' +
                            '<td>' + executiveName  + '</td>' + 
                        '</tr>' +
                        '</div>';
            }
            var tableHTML = '<table id="leadTableReport" class="table table-striped table-bordered table-responsive" font-size:14px;>'+
            '<thead>'+
                '<tr>'+
                    '<th>School Name</th>'+
					'<th>School Address</th>'+
					'<th>School Contact Person</th>'+
					'<th>Contact No</th>'+
					'<th>School Setup</th>'+
                    '<th>City</th>'+
                    '<th>State</th>'+
                    '<th>Executive Name</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody id="leadTableRows">'+
            '</tbody>'+
            '</table>';
            console.log(tableHTML);
            $(".verifiedTableForLead").html(tableHTML);
            $("#leadTableRows").html(html);
            $('#leadTableReport').DataTable(); 
        }
        else
        {
            alert(res.Message);	
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