// TZ#523 Aishwarya added Activity Report
w3.includeHTML();
$(document).ready(function()
{
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForLead");
    
		JSONToCSVConvertor(data, "ExcelDownloadForLead", true);
	});
});
function _convertDate(str)
{
    var date = new Date(str);
    var dd = date.getDate();
	var mm = date.getMonth();
    var yyyy = date.getFullYear();
	return dd + "/" + mm + "/" + yyyy;
}
$(document).on("click", "#btnSubmit", function()
{
    var selDate = $("#txtDate").val();
    var featureName= "CREATED";
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
    selDate=_convertDate(selDate);
    
    /*TZ-542 Aishwarya 07/08/2018 added base url */
    var url=TRAKKERZ_REPORTS_BASE_URL + "Actions/FetchLeadDetailsByParams";
    var params = ["FeatureName","FeatureValue"];
    var values = [featureName,selDate];
    
    var dataString = createJSON(params, values);
    var data="{'LeadParams':[" + dataString +"]}";
    console.log(data);
    ajaxCall(url, "POST", data, "application/json", leadSuccess);		
});
function leadSuccess(res)
{
    if(res.IsOk)
	{
        res = res.ResponseObject;
        var html = '';
        var excelDownload=[];
        
		for(var i = 0; i < res.length; ++i)
		{
			var activityTime = res[i].ActivityTime;
			var city = res[i].City;
			var contactNumber = res[i].ContactNumber;
			var lead = res[i].Lead;
            var leadCreator = res[i].LeadCreator;  
            var appointment = res[i].NextAppointmentDate;
			var purpose = res[i].Purpose;
			var schoolContactPerson = res[i].SchoolContactPerson;
			var spendStatus= res[i].SPENDStatus;
            var state = res[i].State;
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
            innerDetails["Activity_Date"] = activityTime;
            innerDetails["School_Name"] = lead;
            innerDetails["Executive_Name"] = leadCreator;
            innerDetails["School_Contact_Person"] = schoolContactPerson;
            innerDetails["Contact_Number"] = contactNumber;
            innerDetails["Status"] = spendStatus;
            innerDetails["Next_appointment_date"] = appointment;
            innerDetails["Purpose"] = purpose;
            innerDetails["City"] = city;
            innerDetails["State"] = state;
            excelDownload[excelDownload.length]=innerDetails;
            
            html += '<div>' +
            '<tr>' + 
            '<td>' + activityTime + '</td>' + 
            '<td>' + lead + '</td>' +
            '<td>' + leadCreator + '</td>' +  
            '<td>' + schoolContactPerson + '</td>' + 
            '<td>' + contactNumber + '</td>' +
            '<td>' + spendStatus + '</td>' +  
            '<td>' + appointment + '</td>' + 
            '<td>' + purpose + '</td>' +
            '<td>' + city + '</td>' + 
            '<td>' + state + '</td>' +   
            '</tr>' +
            '</div>';
        }
        var tableData = '<table id="leadTableReport" class="table table-striped table-bordered table-responsive">'+
        '<thead>' +
        '<tr>' +   
            '<th>Activity Date</th>' +                  
            '<th>School Name</th>' +
            '<th>Executive Name</th>' + 
            '<th>School Contact Person</th>' +                  
            '<th>Contact Number</th>' +
            '<th>Status</th>' + 
            '<th>Next Appointment Date</th>' +                  
            '<th>Purpose</th>' +
            '<th>City</th>' + 
            '<th>State</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="leadTableRows">' +
        '</tbody>' +
        '</table>';
        var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
        $(".tableForLead").html(tableData);
        $("#downloadExcel").html(downloadButton);
		$("#leadTableRows").html(html);
        $('#leadTableReport').DataTable(); 
        localStorage.setItem("ExcelDownloadForLead",JSON.stringify(excelDownload));
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
		//$("#leadTableRows").html("Sorry, No Records found.");	
	}
}