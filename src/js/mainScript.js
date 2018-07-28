$(document).ready(function()
{
    $("#col1").on("click", "#linkHygieneCheckReport", function()
    {
        if(localStorage.getItem("Response"))
            {
                localStorage.clear();
            }
    });
});
function createJSON(params, values)
{
    if(params.length !== values.length)
    {
        return "";
    }

    var json = {};
    
    for(var i = 0; i < params.length; ++i)
    {
        json[params[i]] = values[i];
    }

    return JSON.stringify(json);
}


function ajaxCall(url, type, dataString, contentType, callBackMethod)
{
    $.ajax(
    {
        url: url,
        type: type,
        data: dataString,
        contentType: contentType,
        
        success: function (data)
        {
            if (typeof (callBackMethod) == "function")
            {
                callBackMethod(data);
            }
            else
            {
                if (callBackMethod != "")
                {
                    eval(callBackMethod + "('" + data + "')");
                }
            }
        },
        error: function (jqXHR, textStatus, ex)
        {
            handleAjaxError(jqXHR, textStatus, ex);
        }
    });
}