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
    //     person=null;
    // if(group == "")
    //     group=7609;

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
    if(!!res.IsOk === true)
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
            var services = res[i].LeadServicesList;
            //var voiceSms,voiceCall,flexInstallation,adminTraining,teacherTraining,parentTraining,studentTraining,other;
            var person = {collections:0, voiceCall:0, flexInstallation:0,adminTraining:0,teacherTraining:0,parentTraining:0,studentTraining:0,other:0};
            for(var serviceIndex=0; serviceIndex<services.length; serviceIndex ++)
            {
                var details=services[serviceIndex]["ServiceName"];
                //details=details.capitalize();
                switch(details)
                {
                    case "Voice Call": 
                                person.voiceCall=1;
                                break;
                    case "Collections": 
                                person.collections=1;
                                break;
                    case "Parent Training": 
                                person.parentTraining=1;
                                break;
                    case "Admin Training": 
                                person.adminTraining=1;
                                break;
                    case "Teacher Training": 
                                person.teacherTraining=1;
                                break;
                    case "Student Training": 
                                person.studentTraining=1;
                                break;
                    case "Flex Installation": 
                                person.flexInstallation=1;
                                break;
                    case "Other": 
                                person.other=1;
                                break;
                }
            }
            var setupStatusIcon,voiceCallIcon,collectionsIcon,parentTrainingIcon,teacherTrainingIcon,adminTrainingIcon,studentTrainingIcon,flexIcon,otherIcon;
            if(!schoolSetup)
            {
                setupStatusIcon = "fa-remove text-danger"
            }
            else
            {
                setupStatusIcon = "fa-check text-success";
            }

            if(!person.voiceCall)
            {
                voiceCallIcon = "fa-remove text-danger"
            }
            else
            {
                voiceCallIcon = "fa-check text-success";
            }

            if(!person.collections)
            {
                collectionsIcon = "fa-remove text-danger"
            }
            else
            {
                collectionsIcon = "fa-check text-success";
            }

            if(!person.parentTraining)
            {
                parentTrainingIcon = "fa-remove text-danger"
            }
            else
            {
                parentTrainingIcon = "fa-check text-success";
            }

            if(!person.adminTraining)
            {
                adminTrainingIcon = "fa-remove text-danger"
            }
            else
            {
                adminTrainingIcon = "fa-check text-success";
            }
            
            if(!person.teacherTraining)
            {
                teacherTrainingIcon = "fa-remove text-danger"
            }
            else
            {
                teacherTrainingIcon = "fa-check text-success";
            }
            
            if(!person.studentTraining)
            {
                studentTrainingIcon = "fa-remove text-danger"
            }
            else
            {
                studentTrainingIcon = "fa-check text-success";
            }
            
            if(!person.flexInstallation)
            {
                flexIcon = "fa-remove text-danger"
            }
            else
            {
                flexIcon = "fa-check text-success";
            }

            if(!person.other)
            {
                otherIcon = "fa-remove text-danger"
            }
            else
            {
                otherIcon = "fa-check text-success";
            }

            html += '<div>' +
                    '<tr class="small">' + 
                        '<td>' + leadName + '</td>' + 
                        '<td>' + contactPerson + '</td>' +
                        '<td>' + contactNo + '</td>' +
                        '<td>' + state + '</td>' +
                        '<td>' + city + '</td>' + 
                        '<td>' + executiveName  + '</td>' +
                        '<td class="text-center"><i class="fa ' + setupStatusIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + voiceCallIcon + ' fa-2x"</td>' + 
                        '<td class="text-center"><i class="fa ' + flexIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + adminTrainingIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + teacherTrainingIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + parentTrainingIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + studentTrainingIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + otherIcon + ' fa-2x"</td>' +
                        '<td class="text-center"><i class="fa ' + collectionsIcon + ' fa-2x"</td>' +  
                    '</tr>' +
                    '</div>';
        }
            
        var tableHtml = '<table id="leadStatusTable" class="table table-striped table-bordered table-responsive">'+
        '<thead>'+
            '<tr>'+
                '<th>School Name</th>'+
                '<th>Contact Person</th>'+
                '<th>Contact no</th>'+
                '<th>State</th>'+
                '<th>City</th>'+
                '<th>Executive</th>'+
                '<th>School Setup</th>'+
                '<th>Voice Call</th>'+
                '<th>Flex Installation</th>'+
                '<th>Admin Training</th>'+
                '<th>Teacher Training</th>'+
                '<th>Parent Training</th>'+
                '<th>Student Training</th>'+
                '<th>Others</th>'+
                '<th>Collection</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody id="statusTableRows">' +
        '</tbody>'+
        '</table>';
        $(".statusTableForLead").html(tableHtml);

        $("#statusTableRows").html(html);
        $('#statusTableReport').DataTable(); 
    }
    else
    {
        $("#statusTableRows").html("Sorry, No Records found."); 
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