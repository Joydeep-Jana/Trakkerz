// TZ-509 Aishwarya added Report for Hygiene Check Report for Activities
w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("change", "#formControlSelectPerson", generateLeads);
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForHygieneActivityReport");
        
		JSONToCSVConvertor(data, "ExcelDownloadForHygieneActivityReport", true);
	});
});

$(document).on("click", "#btnSubmit", function()
{
    var fromDate = $("#txtFromDate").val();
    var toDate = $("#txtToDate").val();
    var person = $("#formControlSelectPerson").val();
    var group  = $("#formControlSelectGroup").val();
    var leadId = $("#formControlSelectSchool").val();
    
        /*+TZ-542 Aishwarya 07/08/2018 added alert box*/
        if(fromDate == "")
        {
            $.confirm(
                {
                    title: 'Alert!',
                    content: "Please enter From Date",
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
                    content: "Please enter To Date",
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
                    content: "From date should be before To date!",
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
    /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/NewActivities";
    var params = ["FromDate", "ToDate", "PersonId", "GroupId","LeadId"];
    var values = [fromDate, toDate, person, group,leadId];
    
    var dataString = createJSON(params, values);
    
    ajaxCall(url, "POST", dataString, "application/json", hygieneActivitySuccess);		
    
});
function hygieneActivitySuccess(res)
{
    if(!!res.IsOk === true)
	{
        res = res.ResponseObject;
        console.log(res);
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var activity = res[i].Activity;
			var activityCreationDate = res[i].ActivityCreationDate;
			var activityCreator = res[i].ActivityCreator;
			var amount = res[i].Amount;
			var clientVisit = res[i].ClientVisit;
			var collectionImage = res[i].CollectionImage;
            var leadId = res[i].LeadId;
            var leadName = res[i].LeadName;
            var method = res[i].Method;
            var spendStatus = res[i].SPENDStatus;
            var nextAppointmentDate = res[i].NextAppointmentDate;
            var purpose = res[i].Purpose;
            var referenceNumber= res[i].ReferenceNumber;
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
            var collectionImageIcon,activityIcon,purposeIcon,remarksIcon,amountIcon,clientVisitIcon,nextAppointmentDateIcon,methodIcon,referenceNumberIcon;
            var innerDetails = {};
            innerDetails["School_Name"] = leadName;
            if(activity==" ")
            {
                activityIcon = "fa-remove text-danger";
                innerDetails["Activity"] = "No";
            }
            else
            {
                activityIcon = "fa-check text-success";
                innerDetails["Activity"] = "Yes";
            }
            if(purpose==" ")
            {
                innerDetails["Purpose"] = "No";
                purposeIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Purpose"] = "Yes";
                purposeIcon = "fa-check text-success";
            }
            innerDetails["Activity_creator"] = activityCreator;
            if(remarks==" ")
            {
                innerDetails["Remarks"] = "No";
                remarksIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Remarks"] = "Yes";
                remarksIcon = "fa-check text-success";
            }
            if(nextAppointmentDate==" ")
            {
                innerDetails["Next_appointment_date"] = "No";
                nextAppointmentDateIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Next_appointment_date"] = "Yes";
                nextAppointmentDateIcon = "fa-check text-success";
            }
            innerDetails["Status"] = spendStatus;
            innerDetails["Activity_creation_date"] = activityCreationDate;
            if(method==" " || method=="")
            {
                innerDetails["Method"] = "No";
                methodIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Method"] = "Yes";
                methodIcon = "fa-check text-success";
            }
            if(referenceNumber==" " || referenceNumber=="")
            {
                innerDetails["Reference_Number"] = "No";
                referenceNumberIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Reference_Number"] = "Yes";
                referenceNumberIcon = "fa-check text-success";
            }
            if(amount==0 || amount==" ")
            {
                innerDetails["Amount"] = "No";
                amountIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Amount"] = "Yes";
                amountIcon = "fa-check text-success";
            }
            if(clientVisit==" " || clientVisit=="")
            {
                innerDetails["Client_visit"] = "No";
                clientVisitIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Client_visit"] = "Yes";
                clientVisitIcon = "fa-check text-success";
            }
            if(collectionImage==" " || collectionImage=="")
            {
                innerDetails["Collection_image"] = "No";
                collectionImageIcon = "fa-remove text-danger";
            }
            else
            {
                innerDetails["Collection_image"] = "Yes";
                collectionImageIcon = "fa-check text-success";
            }
            
            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr>' + 
            '<td>' + leadName + '</td>' + 
            '<td class="text-center"><i class="fa ' + activityIcon + ' fa-2x"</td>' + 
            '<td class="text-center"><i class="fa ' + purposeIcon + ' fa-2x"</td>' + 
            '<td>' + activityCreator + '</td>' +
            '<td class="text-center"><i class="fa ' + remarksIcon + ' fa-2x"</td>' + 
            '<td class="text-center"><i class="fa ' + nextAppointmentDateIcon + ' fa-2x"</td>' + 
            '<td>' + spendStatus  + '</td>' + 
            '<td>' + activityCreationDate  + '</td>' + 
            '<td class="text-center"><i class="fa ' + methodIcon + ' fa-2x"</td>' +   
            '<td class="text-center"><i class="fa ' + referenceNumberIcon + ' fa-2x"</td>' + 
            '<td class="text-center"><i class="fa ' + amountIcon + ' fa-2x"</td>' + 
            '<td class="text-center"><i class="fa ' + clientVisitIcon + ' fa-2x"</td>' +  
            '<td class="text-center"><i class="fa ' + collectionImageIcon + ' fa-2x"</td>' +  
            '</tr>' +
            '</div>';
        }
        var tableData = '<table id="hygieneActivityTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +   
        '<th>School Name</th>' +                  
        '<th>Activity</th>' +
        '<th>Purpose</th>' + 
        '<th>Activity Creator</th>' +
        '<th>Remarks</th>' +
        '<th>Next Appointment Date</th>' +
        '<th>Status</th>' + 
        '<th>Activity Creation Date</th>' + 
        '<th>Method</th>' +
        '<th>Reference Number</th>' +
        '<th>Amount</th>' + 
        '<th>Client Visit</th>' + 
        '<th>Collection Image</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="hygieneActivityTableRows">' +
        '</tbody>' +
        '</table>';
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
		$("#downloadExcel").html(downloadButton);
        $(".hygieneActivityForLead").html(tableData);
        $("#hygieneActivityTableRows").html(html);
        $('#hygieneActivityTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForHygieneActivityReport",JSON.stringify(excelDownload));
	}
	else
	{
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Sorry, No Records found.",
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
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
		$("#hygieneActivityTableRows").html("Sorry, No Records found.");	
	}
}
function gatherGroups()
{
    /*TZ-542 Aishwarya 07/08/2018 added base url */
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
        /*TZ-542 Aishwarya 07/08/2018 added base url */
        var url = TRAKKERZ_GROUPS_BASE_URL + "GetMembersByGroupId";
        var dataString = "{'GroupId':" + this.value + "}";
        ajaxCall(url, "POST", dataString, "application/json", function(res)
        {
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
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
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
            return false;
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    }
}
function generateLeads()
{
    if(this.value != "" && this.value != "Select Group")
    {
        /*TZ-542 Aishwarya 07/08/2018 added base url */
        var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/NewActivities";
        var fromDate = $("#txtFromDate").val();
        var toDate = $("#txtToDate").val();
        var person = $("#formControlSelectPerson").val();
        var group  = $("#formControlSelectGroup").val();
        var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
        var values = [fromDate, toDate, person, group];
        var dataString = createJSON(params, values);

        ajaxCall(url, "POST", dataString, "application/json", function(res)
        {
            var data = res.ResponseObject;
            var html = "<option>Select School</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].LeadId + "'>" + data[index].LeadName + " </option>";
            }
            $("#formControlSelectSchool").html(html);
        });
    }
    else
    {
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
        $.confirm(
            {
                title: 'Alert!',
                content: "Please Select a valid Person.",
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
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    }
}