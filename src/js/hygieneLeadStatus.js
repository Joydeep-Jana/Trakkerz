w3.includeHTML();
var table;
$(document).ready(function()
{
    if(localStorage.getItem("Response"))
    {
        setTimeout(function(){
            hygieneLeadSuccess(JSON.parse(localStorage.getItem("Response")));       
        },1000); 
    }
    gatherGroups();
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    /*TZ-519 Aishwarya added this code to download csv */
    $("#col2").on("click", "#btnDownload", function()
	{
		var data = localStorage.getItem("ExcelDownloadForHygieneLead");
        
		JSONToCSVConvertor(data, "ExcelDownloadForHygieneLead", true);
	});
    
    $(document).on("click", "#btnSubmit", function()
    {
        var fromDate = $("#selFromDate").val();
        var toDate = $("#selToDate").val();
        var person = $("#formControlSelectPerson").val();
        var group  = $("#formControlSelectGroup").val();
        
        /*+ TZ-542 Aishwarya 07/08/2018 added alert box*/
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
        /*-TZ-542 Aishwarya 07/08/2018 added alert box*/
        localStorage.setItem("FromDate", fromDate);
        localStorage.setItem("ToDate", toDate);
        
        /*-TZ-542 Aishwarya 07/08/2018 added base url*/
        var url = TRAKKERZ_REPORTS_BASE_URL + "Reports/HygieneCheckForLeads";
        var params = ["FromDate", "ToDate", "PersonId", "GroupId"];
        var values = [fromDate, toDate, person, group];
        
        var dataString = createJSON(params, values);

        ajaxCall(url, "POST", dataString, "application/json", hygieneLeadSuccess);		
        
    });
    function hygieneLeadSuccess(res)
    {
        if(!!res.IsOk === true)
        {
            localStorage.setItem("Response",JSON.stringify(res));
            res = res.ResponseObject;
            var resp = JSON.stringify(res);
            localStorage.setItem("AllData", resp);
            var html = '';
            /*TZ-519 Aishwarya added this code to download csv */
            var excelDownload=[];
            
            for(var i = 0; i < res.length; ++i)
            {
                var leadName = res[i].LeadName;
                var contactPerson = res[i].SchoolContactPerson;
                var contactNo = res[i].ContactNumber;
                var state = res[i].State;
                var city = res[i].City;
                var status = res[i].SPENDStatus;
                var schoolType = res[i].SchoolType;
                var schoolStrength = res[i].NoOfStudents;
                var designation = res[i].Designation;
                var email = res[i].EmailId;
                var bill=res[i].BillRaised;
                var conversionDate=res[i].ConversionDate;
                var conversionDateFormat = res[i].ConversionDate;
                if(conversionDateFormat!="")
                    conversionDateFormat= _convertDate(conversionDateFormat);

                var designation=res[i].Designation;
                var email=res[i].EmailId;
                var installationCharge=res[i].InstallationCharge;
                var lastUpdated=res[i].LastUpdated;
                var lastUpdatedFormat = lastUpdated;
                if(lastUpdatedFormat!="")
                    lastUpdatedFormat= _convertDate(lastUpdatedFormat);
                var leadAddress=res[i].LeadAddress;
                var leadId=res[i].LeadId;
                var leadLatitude=res[i].LeadLatitude;
                var leadLongitude=res[i].LeadLongitude;
                var leadName=res[i].LeadName;
                var address=res[i].LocalAddress;
                var months=res[i].MonthsFree;
                var amount=res[i].NegotiatedAmount;
                var appointment=res[i].NextAppointmentDate;
                var nextDate = appointment;
                if(nextDate!="")
                    nextDate= _convertDate(nextDate);
                var students=res[i].NoOfStudents;
                var terms=res[i].PaymentTerms;
                var quotationDate=res[i].QuotationDate;
                var quotationDateFormat = quotationDate;
                if(quotationDateFormat!="")
                    quotationDateFormat= _convertDate(quotationDateFormat);
                var quotationStage=res[i].QuotationStage;
                var remarks=res[i].Remarks;
                var rsStudentPerMonth=res[i].RsPerStudentPerMonth;
                var smsCharge=res[i].SMSCharge;
                var smsFree=res[i].SMSFree;
                var status=res[i].SPENDStatus;
                var contactPerson=res[i].SchoolContactPerson;
                var schoolType=res[i].SchoolType;
                var source=res[i].Source;
                var sourceDetails=res[i].SourceDetails;
                var state=res[i].State;
                switch(status)
                {
                    case 'S': 
                    status="Suspecting";
                    break;
                    case 'P': 
                    status="Prospecting";
                    break;
                    case 'E': 
                    status="Expecting";
                    break;
                    case 'N': 
                    status="Not Done";
                    break;
                    case 'D': 
                    status="Done";
                    break;
                }
                /*TZ-519 Aishwarya added this code to download csv */
                var innerDetails = {};
                innerDetails["School_Id"] = leadId;
				innerDetails["School_Name"] = leadName;
				innerDetails["School_Address"] = leadAddress;
                innerDetails["School_strength"] = students;
				innerDetails["Rupees_from_Student_Per_month"] = rsStudentPerMonth;
				innerDetails["School_type"] = schoolType;
                innerDetails["Status"] = status;
                innerDetails["Lead_longitude"] = leadLongitude;
				innerDetails["Lead_latitude"] = leadLatitude;
                innerDetails["Contact_Person"] = contactPerson;
                innerDetails["Designation"] = designation;
                innerDetails["Contact_no"] = contactNo;
				innerDetails["Address"] = address;
				innerDetails["Email"] = email;
                innerDetails["Next_appointment_date"] = nextDate;
                innerDetails["City"] = city;
                innerDetails["State"] = state;
                innerDetails["Source"] = source;
                innerDetails["Source_details"] = sourceDetails;
                innerDetails["Quotation_date"] = quotationDateFormat;
                innerDetails["Quotation_stage"] = quotationStage;
                innerDetails["SMS_charge"] = smsCharge;
                innerDetails["No_of_SMS_free"] = smsFree;
                innerDetails["No_of_months_free"] = months;
                innerDetails["Conversion_date"] = conversionDateFormat;
                innerDetails["Last_updated"] = lastUpdatedFormat;
                innerDetails["Installation_charge"] = installationCharge;
                innerDetails["Negotiated_amount"] = amount;
                innerDetails["Bill_raised"] = bill;
				innerDetails["Payment_terms"] = terms;
                innerDetails["Remarks"] = remarks;
                
                excelDownload[excelDownload.length]=innerDetails;
                
                html += '<div>' +
                '<tr class="small">' + 
                '<td>' + leadName + '</td>' + 
                '<td>' + contactPerson + '</td>' + 
                '<td>' + contactNo + '</td>' + 
                '<td>' + state + '</td>' +
                '<td>' + city + '</td>' + 
                '<td>' + status + '</td>' + 
                '<td>' + schoolType + '</td>' + 
                '<td>' + schoolStrength + '</td>' + 
                '<td>' + designation  + '</td>' + 
                '<td>' + email  + '</td>' +
                '<td><a href="#" class="text-primary" id=' + "viewHygieneTable_" + res[i].LeadId + '>'+
                'View more' +
                '</a>'+ 
                '</td>'+
                '</tr>' +
                '</div>';
            }
            /*TZ-519 Aishwarya added this code to download csv */
            var downloadButton = '<button type="button" class="btn btn-primary rounded-0 text-uppercase" id="btnDownload" >Download Excel</button>';
            
            
            var tableData = '<table id="hygieneTableReport" class="table table-striped table-bordered table-responsive">'+
            '<thead>'+
            '<tr>'+
            '<th>School Name</th>'+
            '<th>Contact Person</th>'+
            '<th>Contact No</th>'+
            '<th>State</th>'+
            '<th>City</th>' +
            '<th>Lead Status</th>' +
            '<th>School Type</th>' +                      
            '<th>Student Strength Range</th>' +
            '<th>Contact Person Designation</th>' + 
            '<th>Contact Person Email</th>' +
            '<th>Actions</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="hygieneTableRows">' +
            '</tbody>' +
            '</table>';
            $(".hygieneTableForLead").html(tableData);
            $("#hygieneTableRows").html(html);
            table = $('#hygieneTableReport').DataTable();
            /*TZ-519 Aishwarya added this code to download csv */
            $("#downloadExcel").html(downloadButton);
            localStorage.setItem("ExcelDownloadForHygieneLead",JSON.stringify(excelDownload));
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
            table.clear().draw();	
        }
    }
});
$(document).on("click", "[id^='viewHygieneTable_']", function()
{
    var idForView = $(this).attr("id").split("_");
    localStorage.setItem("IdForView", idForView[1]);
	window.location.href = "./hygieneTableView.html";
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
function _convertDate(str)
{
    var date = new Date(str);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dd = date.getDate();
	var mm = months[date.getMonth()];
    var yyyy = date.getFullYear();
    
	return dd + "/" + mm + "/" + yyyy;
}