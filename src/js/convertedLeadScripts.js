w3.includeHTML();

$(document).ready(function()
{
    gatherGroups();
    // $('#example').DataTable(
    // {

    // });
    $("#col2").on("click", "#btnSubmit", submited);
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
});

function submited()
{
    var url="http://Management.trakkerz.com/api/Reports/NewLeads";
    var fromDate = $("#selFromDate").val();
    var toDate = $("#selToDate").val();
    var personId = $("#formControlSelectPerson").val();
    var group = $("#formControlSelectGroup").val();
    if(fromDate == "")
    {
        alert("Please select From date");
        return;
    }
    if(toDate == "")
    {
        alert("Please select To date");
        return;
    }
    if(group == 0)
    {
        alert("Please select a group");
        return;
    }
    if(personId == 0)
    {
        alert("Please select a person");
        return;
    }
    var params = ["FromDate","ToDate", "PersonId", "GroupId"];
    var values = [fromDate,toDate, group, personId];
    var dataString = createJSON(params,values);
    ajaxCall(url, "POST", dataString, "application/json", submitedResponse);
}
function submitedResponse(res)
{
    console.log(res);
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
    else
    {
        alert(res.Message);
    }
}

function gatherGroups()
{
    var url = "http://trakkerz.trakkerz.com/api/Groups/GetGroupsByOrganizationId";
    var dataString = {"OrganizationId=1":1};
    dataString = JSON.stringify(dataString);
    ajaxCall(url, "POST", dataString, "application/json", function(res)
    {
        var data = res.ResponseObject;
        html = "<option value=0 >Select Group</option>";
        for(var index=0; index<data.length; index++)
        {
            html += "<option value='" + data[index].GroupId + "'>" + data[index].GroupName + "</option>";
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
            var html = "<option value=0 >Select Person</option>";
            for(var index=0; index<data.length; index++)
            {
                html += "<option value='" + data[index].PersonId + "'>" + data[index].FirstName + data[index].LastName + "</option>";
            }
            $("#formControlSelectPerson").html(html);
        });
    }
    else
    {
        alert("Please Select a valid Group.");
    }
}