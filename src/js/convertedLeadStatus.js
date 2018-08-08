w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    /*TZ-519 Aishwarya added this code to download csv */
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForConvertedLeadStatus");
        
		JSONToCSVConvertor(data, "ExcelDownloadForConvertedLeadStatus", true);
    });
    
    $(document).on("click", "#btnSubmit", function()
    {
        var fromDate = $("#selFromDate").val();
        var toDate = $("#selToDate").val();
        var person = $("#formControlSelectPerson").val();
        var group  = $("#formControlSelectGroup").val();
        
        /*+TZ-542 Aishwarya 08/08/2018 added alert box*/
    if(fromDate == "")
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please select From date",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    if(toDate == "")
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please select To date",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    
    if(toDate < fromDate)
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "From date should be before To date",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            return false;
    }
    /*-TZ-542 Aishwarya 08/08/2018 added alert box*/
    
    /*TZ-542 Aishwarya 08/08/2018 added base url */
    var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/ConvertedLeadsStatus";
        var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
        var values = [fromDate, toDate, person, group];
        
        var dataString = createJSON(params, values);
        
        //alert(dataString);
        ajaxCall(url, "POST", dataString, "application/json", verifiedLeadSuccess);		
        
    });
    function verifiedLeadSuccess(res)
    {
        if(!!res.IsOk === true)
        {
            res = res.ResponseObject;
            var html = '';
            /*TZ-519 Aishwarya added this code to download csv */
            var excelDownload=[];
            
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
                var person = {collections:0,voiceCall:0, flexInstallation:0,adminTraining:0,teacherTraining:0,parentTraining:0,studentTraining:0,other:0};
                for(var serviceIndex=0; serviceIndex<services.length; serviceIndex ++)
                {
                    var details=services[serviceIndex]["ServiceName"];
                    //details=details.capitalize();
                    switch(details)
                    {
                        case "Voice Call": 
                        person.voiceCall=1;
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
                        case "Collections": 
                        person.collections=1;
                        break;
                        case "Other": 
                        person.other=1;
                        break;
                    }
                }
                var collectionsIcon,setupStatusIcon,voiceCallIcon,parentTrainingIcon,teacherTrainingIcon,adminTrainingIcon,studentTrainingIcon,flexIcon,otherIcon;
                if(!schoolSetup)
                {
                    setupStatusIcon = "fa-remove text-danger"
                }
                else
                {
                    setupStatusIcon = "fa-check text-success";
                }
                if(!person.collections)
                {
                    collectionsIcon = "fa-remove text-danger"
                }
                else
                {
                    collectionsIcon = "fa-check text-success";
                }
                
                if(!person.voiceCall)
                {
                    voiceCallIcon = "fa-remove text-danger"
                }
                else
                {
                    voiceCallIcon = "fa-check text-success";
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
                /*TZ-519 Aishwarya added this code to download csv */
                var innerDetails = {};
                innerDetails["School_Name"] = leadName;
                innerDetails["Contact_Person"] = contactPerson;
                innerDetails["Contact_no"] = contactNo;
                innerDetails["State"] = state;
                innerDetails["City"] = city;
				innerDetails["Executive_name"] = executiveName;
                if(schoolSetup)
                innerDetails["School_Setup"]="Yes";
                else
                innerDetails["School_Setup"]="No";
                if(person.voiceCall)
                {
                    innerDetails["Voice_Call"] = "Yes";
                }
                else
                {
                    innerDetails["Voice_Call"] = "No";
                }
                if(person.flexInstallation)
                {
                    innerDetails["Flex_Installation"] = "Yes";
                }
                else
                {
                    innerDetails["Flex_Installation"] = "No";
                }
                if(person.adminTraining)
                {
                    innerDetails["Admin_Training"] = "Yes";
                }
                else
                {
                    innerDetails["Admin_Training"] = "No";
                }
                if(person.teacherTraining)
                {
                    innerDetails["Teacher_Training"] = "Yes";
                }
                else
                {
                    innerDetails["Teacher_Training"] = "No";
                }
                if(person.parentTraining)
                {
                    innerDetails["Parent_Training"] = "Yes";
                }
                else
                {
                    innerDetails["Parent_Training"] = "No";
                }
                if(person.studentTraining)
                {
                    innerDetails["Student_Training"] = "Yes";
                }
                else
                {
                    innerDetails["Student_Training"] = "No";
                }
                if(person.other)
                {
                    innerDetails["Other"] = "Yes";
                }
                else
                {
                    innerDetails["Other"] = "No";
                }
                if(person.collections)
                {
                    innerDetails["Collections"] = "Yes";
                }
                else
                {
                    innerDetails["Collections"] = "No";
                }
				excelDownload[excelDownload.length]=innerDetails;
                
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
            /*TZ-519 Aishwarya added this code to download csv */
            var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';  
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
            '<th>Collections</th>'+
            '</tr>'+
            '</thead>'+
            '<tbody id="statusTableRows">' +
            '</tbody>'+
            '</table>';
            /*TZ-519 Aishwarya added this code to download csv */
            localStorage.setItem("ExcelDownloadForConvertedLeadStatus",JSON.stringify(excelDownload));
            
            $("#downloadExcel").html(downloadButton);
            $(".statusTableForLead").html(tableHtml);
            
            $("#statusTableRows").html(html);
            $('#leadStatusTable').DataTable(); 
        }
        else
        {
            /*+ TZ-542 Aishwarya 08/08/2018 added alert box*/
            $.confirm(
            {
                title: 'Alert!',
                content: "Sorry, No Records found",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
            /*- TZ-542 Aishwarya 08/08/2018 added alert box*/	
        }
    }
});
function gatherGroups()
{
    /*TZ-542 Aishwarya 08/08/2018 added base url */
    var url = TRAKKERZ_GROUPS_BASE_URL + "GetGroupsByOrganizationId";
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
        /*TZ-542 Aishwarya 08/08/2018 added base url */
        var url = TRAKKERZ_GROUPS_BASE_URL + "GetMembersByGroupId";
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
        /*+ TZ-542 Aishwarya 08/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Please Select a valid Group.",
                type: 'blue',
                animateFromElement: false,
                animation: 'top',
                closeAnimation: 'scale',
                draggable: true,
                buttons: 
                {
                    Ok: 
                    {
                        text: 'Ok',
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function()
                        { 
                        }
                    },
                    close: function () 
                    {
                    }
                }
            });
        /*- TZ-542 Aishwarya 08/08/2018 added alert box*/
    }
}