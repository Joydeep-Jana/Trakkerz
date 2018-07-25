w3.includeHTML();

$(document).ready(function()
{
    $('#example').DataTable(
    {

    });
    $("#col2").on("click", "#btnSubmit", submited);
});

function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/NewLeads";
    var fromDate = $("#selFromDate").val();
    var toDate = $("#selToDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    var params = ["FromDate","ToDate"];
    var values = [fromDate,toDate];
    var dataString = createJSON(params,values);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}
function submitedResponse(res)
{
    // console.log(res);
    // console.log(res.IsOk);
    if(res.IsOk)
    {
        var dataArray = new Array();
        var mainData = res.ResponseObject;
        console.log(res);
        // console.log(data);
        for(var index=0; index<mainData.length; index++)
        {
            var temp = new Array();
            temp.push(mainData[index].LeadId);
            temp.push(mainData[index].LeadCreator);
            temp.push(mainData[index].LeadName);
            temp.push(mainData[index].ContactNumber);
            temp.push(mainData[index].NextAppointmentDate);
            temp.push(mainData[index].SchoolContactPerson);
            temp.push(mainData[index].State);
            temp.push(mainData[index].City);
            temp.push(mainData[index].Address);
            temp.push(mainData[index].Remarks);
            dataArray.push(temp);
        }
        console.log(dataArray);
        $("#convertedLeadTable").dataTable(
            {
                destroy:true,
                data:dataArray
            }
        );
    }
}