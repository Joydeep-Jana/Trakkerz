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
    
    if(person == "")
    {
        alert("Please select Person");
        return false;
    }

    if(group == "")
    {
        alert("Please select Group");
        return false;
    }

    var url = "https://management.trakkerz.com/api/Reports/ActivityAgeing";
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
        alert("Sorry, No Records found.");
		$("#agiengTableRows").html("Sorry, No Records found.");	
	}
}

function gatherGroups()
{
    var url = "http://trakkerz.trakkerz.com/api/Groups/GetGroupsByOrganizationId";
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
//- TZ#507 06/08/2018 Aishwarya added Report for Ageing of Activities