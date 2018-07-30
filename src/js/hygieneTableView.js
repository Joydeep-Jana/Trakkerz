w3.includeHTML();

// console.log("id is");
// console.log(id);
$(document).ready(function()
{
    setTimeout(ViewHygieneTable, 1000);
    //var str = $("#detailsReport").html();
    //console.log(str);

    ViewHygieneTable();
});

function ViewHygieneTable()
{
    var id=parseInt(localStorage.getItem("IdForView"));
    allData=JSON.parse(localStorage.getItem("AllData"));
    for(var dataIndex = 0; dataIndex<allData.length ; dataIndex++)
    {
        if( allData[dataIndex]["LeadId"] == id )
        {     
            bill=allData[dataIndex]["BillRaised"];
            city=allData[dataIndex]["City"];
            contact=allData[dataIndex]["ContactNumber"];
            conversionDate=allData[dataIndex]["ConversionDate"];
            designation=allData[dataIndex]["Designation"];
            email=allData[dataIndex]["EmailId"];
            installationCharge=allData[dataIndex]["InstallationCharge"];
            lastUpdated=allData[dataIndex]["LastUpdated"];
            leadAddress=allData[dataIndex]["LeadAddress"];
            leadId=allData[dataIndex]["LeadId"];
            leadLatitude=allData[dataIndex]["LeadLatitude"];
            leadLongitude=allData[dataIndex]["LeadLongitude"];
            leadName=allData[dataIndex]["LeadName"];
            address=allData[dataIndex]["LocalAddress"];
            months=allData[dataIndex]["MonthsFree"];
            amount=allData[dataIndex]["NegotiatedAmount"];
            appointment=allData[dataIndex]["NextAppointmentDate"];
            students=allData[dataIndex]["NoOfStudents"];
            terms=allData[dataIndex]["PaymentTerms"];
            quotationDate=allData[dataIndex]["QuotationDate"];
            quotationStage=allData[dataIndex]["QuotationStage"];
            remarks=allData[dataIndex]["Remarks"];
            rsStudentPerMonth=allData[dataIndex]["RsPerStudentPerMonth"];
            smsCharge=allData[dataIndex]["SMSCharge"];
            smsFree=allData[dataIndex]["SMSFree"];
            status=allData[dataIndex]["SPENDStatus"];
            contactPerson=allData[dataIndex]["SchoolContactPerson"];
            schoolType=allData[dataIndex]["SchoolType"];
            source=allData[dataIndex]["Source"];
            sourceDetails=allData[dataIndex]["SourceDetails"];
            state=allData[dataIndex]["State"];
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

        }
    }
    var html = "";
    html += '<div class="row border-bottom mb-3">' +
                '<div class="col-10">' +
                    'Details For ' + leadName +
                '</div>'+
                '<div class="col-2">' +
                    '<button class="btn btn-info mb-2" id="btnViewBack">Back</button>' +
                '</div>'+
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School ID: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ leadId +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School Address: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ leadAddress +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School Strength: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ students +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Rupees from Student Per month: </h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ rsStudentPerMonth +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School Type: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ schoolType +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Status: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ status +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School Longitude: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ leadLongitude +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>School Latitude: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ leadLatitude +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Contact Person: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ contactPerson +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Designation: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ designation +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Contact No: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ contact +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Address: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ address +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Email: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ email +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Next Appointment Date: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ appointment +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>City: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ city +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>State: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ state +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Source: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ source +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Source Details: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ sourceDetails +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Quotation Date: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ quotationDate +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Quotation Stage: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ quotationStage +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>SMS Charge: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ smsCharge +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>No of SMS Free: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ smsFree +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>No of months Free: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ months +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Conversion Date: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ conversionDate +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Last Updated: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ lastUpdated +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Installation Charge: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ installationCharge +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Negotiated Amount: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ amount +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Bill Raised: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ bill +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Payment Terms: </i></h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ terms +'</h6>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-4 text-right">' +
                    '<h6>Remarks: </h6>' +
                '</div>' +
                '<div class="col-md-8">' +
                    '<h6>'+ remarks +'</h6>' +
                '</div>' +
            '</div>';

    $("#detailsReport").html(html);
}
$(document).on('click', "#btnViewBack", function()
{
    window.location.href = "./hygieneLeadReport.html";
    
});
