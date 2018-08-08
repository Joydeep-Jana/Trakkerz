// TZ#523 Aishwarya added Activity Report
w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForAttendance");
        
		JSONToCSVConvertor(data, "ExcelDownloadForAttendance", true);
	});
});
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
            if(name.length>27)
            {
                name = name.substring(0, 27) + "...";
            }
            html += "<option value='" + data[index].GroupId + "'>" + name + "</option>";
        }
        $("#formControlSelectGroup").html(html);
    });
}
$(document).on("click", "#btnSubmit", function()
{
    var activityDate = $("#txtDate").val();
    var group  = $("#formControlSelectGroup").val();
    var organizationId=1;
    /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
    if(activityDate == "")
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please enter Date",
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
    if(group == 0)
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please select Group",
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
        /*-TZ-542 Aishwarya 07/08/2018 added alert box*/
        /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url = TRAKKERZ_REPORTS_BASE_URL + "Actions/FetchActivityHistoryPerday";
    var params = ["OrganizationId","GroupId","ActivityDate"];
    var values = [organizationId,group,activityDate];
    
    var dataString = createJSON(params, values);
    
    ajaxCall(url, "POST", dataString, "application/json", attendanceSuccess);		
});
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
function attendanceSuccess(res)
{
    if(res.IsOk)
	{
        res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var personId = res[i].PersonId;
			var personName = res[i].PersonName;
			var date = res[i].Date;
			var trip = res[i].Trip;
            var activities = res[i].Activities;
            var attendanceIcon,attendance;
            if(!isEmpty(activities))
            {
                attendance = "Present";
                attendanceIcon = "fa-check text-success";
            }   
            else
            {
                attendance = "Absent";
                attendanceIcon = "fa-remove text-danger";
            }
            var innerDetails = {};

            innerDetails["Person_Name"] = personName;
            innerDetails["Attendance"] = attendance;
            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr class="small">' + 
            '<td>' + personName + '</td>' + 
            '<td class="text-center"><i class="fa ' + attendanceIcon + ' fa-2x"</td>' +
            '</tr>' +
            '</div>';
        }
        var tableData = '<table id="attendanceTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +   
        '<th>Name</th>' +                  
        '<th>Attendance</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="attendanceTableRows">' +
        '</tbody>' +
        '</table>';
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
        $(".attendanceTableForLead").html(tableData);
        $("#downloadExcel").html(downloadButton);
        $("#attendanceTableRows").html(html);
        $('#attendanceTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForAttendance",JSON.stringify(excelDownload));
    }
    else
    {
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
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
            /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
        $("#activityTableRows").html("Sorry, No Records found.");	
    }
}