// TZ#523 Aishwarya added Activity Report
w3.includeHTML();
$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForActivity");
        
		JSONToCSVConvertor(data, "ExcelDownloadForActivity", true);
	});
});
/*+Aishwarya TZ#523 06/08/2018 added this code to check whether an object is empty or not*/
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
        return false;
    }
    return true;
}
/*-Aishwarya TZ#523 06/08/2018 added this code to check whether an object is empty or not*/
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
function groupChanged()
{
    if(this.value != "" && this.value != "Select Group")
    {
        /*TZ-542 Aishwarya 07/08/2018 added base url */
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
        /*- TZ-542 Aishwarya 07/08/2018 added alert box*/
    }
}
$(document).on("click", "#btnSubmit", function()
{
    //  TZ#523 Aishwarya added this code to add loader 
    var htmlLoader='<img src="src/img/loader.svg" alt="loader" width="80"/>';
    $("#loaderForActivityResult").html(htmlLoader);
    var selDate = $("#selDate").val();
    var group  = $("#formControlSelectGroup").val();
    var person = $("#formControlSelectPerson").val();
    localStorage.setItem("PersonId",person);
    
    var organizationId=1;
    /*+TZ-542 Aishwarya 07/08/2018 added alert box*/
    if(selDate == "")
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
    if(person == 0)
    {
        $.confirm(
            {
                title: 'Alert!',
                content: "Please select Person",
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
    var url=TRAKKERZ_REPORTS_BASE_URL + "Actions/FetchActivityHistoryPerday";
    var params = ["OrganizationId", "GroupId", "ActivityDate"];
    var values = [organizationId, group, selDate];
    
    var dataString = createJSON(params, values);
    ajaxCall(url, "POST", dataString, "application/json", activitySuccess);		
});
function activitySuccess(res)
{
    if(res.IsOk)
	{
        //  TZ#523 Aishwarya added this code to add loader 
        $("#loaderForActivityResult").hide();
        var person=localStorage.getItem("PersonId");
        //console.log(person);
        res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
            if(person==res[i].PersonId)
            {
                var personName = res[i].PersonName;
                var activities = res[i].Activities;
                if(!isEmpty(activities))
                {
                    for(activityIndex=0;activityIndex<activities.length;activityIndex++)
                    {
                        var name=activities[activityIndex]["Name"];
                        var schoolName=activities[activityIndex]["SchoolName"];
                        var time=activities[activityIndex]["Time"];
                        var innerDetails = {};
                        innerDetails["Person_Name"] = personName;
                        innerDetails["Activity_Name"] = name;
                        innerDetails["School_Name"] = schoolName;
                        innerDetails["Time"] = time;
                        excelDownload[excelDownload.length]=innerDetails;
                        
                        html += '<div>' +
                        '<tr>' + 
                        '<td>' + personName + '</td>' +
                        '<td>' + name + '</td>' +  
                        '<td>' + schoolName + '</td>' +
                        '<td>' + time + '</td>' +
                        '</tr>' +
                        '</div>';
                    }
                    var tableData = '<table id="activityTableReport" class="table table-striped table-bordered table-responsive" style="width:100%">'+
                    '<thead>' +
                    '<tr>' +                   
                    '<th>Person Name</th>' +
                    '<th>Activity Name</th>' + 
                    '<th>School Name</th>' + 
                    '<th>Time</th>' + 
                    '</tr>' +
                    '</thead>' +
                    '<tbody id="activityTableRows">' +
                    '</tbody>' +
                    '</table>';
                    var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
                    $(".activityTableForLead").html(tableData);
                    $("#downloadExcel").html(downloadButton);
                    $("#activityTableRows").html(html);
                    $('#activityTableReport').DataTable(); 
                    localStorage.setItem("ExcelDownloadForActivity",JSON.stringify(excelDownload));
                }
                else
                {
                    /*+Aishwarya TZ#523 06/08/2018 added this code to add activity*/
                    result='<h6 class="border-bottom text-muted">No activity found for ' + personName + ' on this date.</h6>';
                    $(".activityTableForLead").html(result);
                    $("#loaderForActivityResult").hide();
                }
            }
        }
    }
    else
    {
        //  TZ#523 Aishwarya added this code to add loader 
        $("#loaderForActivityResult").hide();
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
    }
}