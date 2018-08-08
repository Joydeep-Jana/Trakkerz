//+ TZ#507 06/08/2018 Aishwarya added Report for Ageing of Activities
w3.includeHTML();

$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForAgieng");
        
		JSONToCSVConvertor(data, "ExcelDownloadForAgieng", true);
	});
});

function _convertDate(str)
{
    var date = new Date(str);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dd = date.getDate();
	var mm = months[date.getMonth()];
    var yyyy = date.getFullYear();
    
	return dd + "-" + mm + "-" + yyyy;
}

$(document).on("click", "#btnSubmit", function()
{
    var group  = $("#formControlSelectGroup").val();
    var person = $("#formControlSelectPerson").val();
    /*+TZ-542 Aishwarya 08/08/2018 added alert box*/
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
                content: "Please enter Person",
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
     /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url=TRAKKERZ_REPORTS_BASE_URL + "/Reports/ActivityAgeing";
    var params = ["GroupId","PersonId"];
    var values = [group, person];
    var dataString = createJSON(params, values);

    ajaxCall(url, "POST", dataString, "application/json", agiengSuccess);		
});

function agiengSuccess(res)
{
    if(res.IsOk)
	{
        res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var schoolName = res[i].LeadName;
            var executiveName = res[i].ResponsiblePerson;
            var state = res[i].State;
            var city = res[i].City;
            var spendStatus= res[i].SPENDStatus;
            var lastVisit = res[i].LastVisitedOn;
            if(lastVisit!="")
            lastVisit= _convertDate(lastVisit);
            var lastUpdated = res[i].ActivityDoneSince;
            lastUpdated= lastUpdated +" days ago";
            var nextAppointment =res[i].NextAppointmentDate;
            if(nextAppointment!="")
            nextAppointment= _convertDate(nextAppointment);
            var feedback = res[i].Remarks;
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

            var innerDetails = {};
            innerDetails["School_Name"] = schoolName;
            innerDetails["Executive_Name"] = executiveName;
            innerDetails["State"] = state;
            innerDetails["City"] = city;
            innerDetails["Lead_status"] = spendStatus;
            innerDetails["Last_visited_on"] = lastVisit;
            innerDetails["Last_update"] = lastUpdated;
            innerDetails["Next_appointment_date"] = nextAppointment;
            innerDetails["Feedback"] = feedback;
            
            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr>' + 
            '<td>' + schoolName + '</td>' + 
            '<td>' + executiveName + '</td>' +
            '<td>' + state + '</td>' +  
            '<td>' + city + '</td>' + 
            '<td>' + spendStatus + '</td>' +
            '<td>' + lastVisit + '</td>' +  
            '<td>' + lastUpdated + '</td>' + 
            '<td>' + nextAppointment + '</td>' +
            '<td>' + feedback + '</td>' +  
            '</tr>' +
            '</div>';
        }

        var tableData = '<table id="agiengTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +                    
        '<th>School Name</th>' +
        '<th>Executive Name</th>' + 
        '<th>State</th>' +                  
        '<th>City</th>' +
        '<th>Lead Status</th>' + 
        '<th>Last Visited</th>' +                  
        '<th>Last Updated</th>' +
        '<th>Next Appointment Date</th>' + 
        '<th>Feedback</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="agiengTableRows">' +
        '</tbody>' +
        '</table>';

        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
        $(".tableForAgieng").html(tableData);
        $("#downloadExcel").html(downloadButton);
        $("#agiengTableRows").html(html);
        $('#agiengTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForAgieng",JSON.stringify(excelDownload));
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
//- TZ#507 06/08/2018 Aishwarya added Report for Ageing of Activities