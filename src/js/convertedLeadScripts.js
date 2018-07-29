w3.includeHTML();

$(document).ready(function()
{
    gatherGroups();
    $("#col2").on("click", "#btnSubmit", submited);
    $("#col2").on("change", "#formControlSelectGroup", groupChanged);
    $("#convertedLeadTable").dataTable();
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
        // alert("Please select a group");
        // return;
        group = null;
    }
    if(personId == 0)
    {
        // alert("Please select a person");
        // return;
        personId = null;
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
        var tableHtml = '<table id="convertedLeadTable" class="table table-striped table-bordered">'+
        '<thead>'+
            '<tr>'+
                '<th>Id</th>'+
                '<th>Creator</th>'+
                '<th>Lead Name</th>'+
                '<th>Contact No.</th>'+
                '<th>Next Appoinment Date</th>'+
                '<th>School Contact Person</th>'+
                '<th>State</th>'+
                '<th>City</th>'+
                '<th>Address</th>'+
                '<th>Remark</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'+
        '</body>'+
        '</table>';
        $(".tableForLead").html(tableHtml);
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
        var url = "http://trakkerz.trakkerz.com/api/Groups/GetMembersByGroupId";
        var dataString = "{'GroupId':" + this.value + "}";
        ajaxCall(url, "POST", dataString, "application/json", function(res){
            // console.log(res);
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