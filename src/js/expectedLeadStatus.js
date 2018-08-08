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
    var url=TRAKKERZ_REPORTS_BASE_URL + "Reports/LeadBySPENDStaus";
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