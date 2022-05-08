const REFRESH_INTERVAL = 60 * 1000 // 1 minute

function outputValueHider(output_element_ID, output_PWM_ID){
  if($(output_element_ID).val() != null){
    $(output_element_ID).on('change', function() {
      let PWM = $(this).val().split("|")[1]
      if (PWM == 0){
        $(output_PWM_ID).fadeOut()
      } else {
        $(output_PWM_ID).fadeIn()
      }
    }).trigger("change")
  }
}

function valueHider(output_element_ID, event_element_ID, output_value){
  if($(output_element_ID).val() != null){
    $(output_element_ID).on('change', function() { 
      let PWM = $(output_element_ID).val().split("|")[1] || {}
      let event = $(event_element_ID).val().split("|")[1] || {}
      if (PWM == 0){
        $(output_value).fadeOut()
      } else {
        if (event == "Output On") {
          $(output_value).fadeIn()
        }
      }
    }).trigger("change")
  

    $(event_element_ID).on('change', function() {
      let PWM = $(output_element_ID).val().split("|")[1]
      let event = $(event_element_ID).val().split("|")[1]
      if (event == 'Output Off'){
        $(output_value).fadeOut()
      } else {
        if(PWM == 1){
          $(output_value).fadeIn()
        }
      }
    }).trigger("change")
  }
}

function outputHider(output_element_ID, element_to_hide, element_to_show, trigger, event){
  $(output_element_ID).on('change', function() {
    let data_event = $(this).val().split("|")[1]
    if (data_event == event){
      $(element_to_hide).fadeOut({done: () => {
        $(element_to_show).fadeIn()
      }})
    } else {$(element_to_show).fadeOut({done: () => {
      $(element_to_hide).fadeIn()
    }})
    }
  })
  if (trigger) {
    $(output_element_ID).trigger("change")
  }
}

function outputHiderz(output_element_ID, variable_div, trigger, events){
  $(output_element_ID).on('change', function() {
    let data_event = $(this).val().split("|")[1]
    let visible_div = "#".concat($(variable_div).children(':visible').attr('id'))
    for (const [key, value] of Object.entries(events)) {      
      if (data_event == key && visible_div != value){
        $(visible_div).fadeOut({done: () => {
          $(value).fadeIn()
        }})
      }
    }
  })
  if (trigger) {
    $(output_element_ID).trigger("change")
  }
 }

//AJAX for timeForm (addTimeEvent)
function timeForm() {
  $('#TimeForm').trigger('reset');
  $('#TimeForm').on('submit', function(e) {
    e.preventDefault();
    $('#TimeSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addTimeEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)  
        $('#manual').html(res.manual);    
        $('#TimeSubmitButton').attr("disabled", false);            
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#TimeForm').trigger("reset");
      },
      error: function(res) {
        $('#TimeSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for sensorForm (addSensorEvent)
function sensorForm() {
  $('#SensorForm').trigger('reset');
  $('#SensorForm').on('submit', function(e) {
    e.preventDefault();
    $('#SensorSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addSensorEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)
        $('#manual').html(res.manual);
        $('#SensorSubmitButton').attr("disabled", false);
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#SensorForm').trigger("reset");
      },
      error: function(res) {
        $('#SensorSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for periodicForm (addPeriodicEvent)
function periodicForm() {
  $('#PeriodicForm').trigger('reset')
  $('#PeriodicForm').on('submit', function(e) {
    e.preventDefault();
    $('#PeriodicSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addPeriodicEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#newScheduleModal').html(res.addEvent)
        $('#manual').html(res.manual);
        $('#PeriodicSubmitButton').attr("disabled", false);             
        // alert(res.msg);
        $('#newScheduleModal').modal('hide');
        $('#PeriodicForm').trigger("reset");
      },
      error: function(res) {
        $('#PeriodicSubmitButton').attr("disabled", false);
        alert(res.responseText);
      }
    });
  });
}

//AJAX for updateForm (updateSchedule)
//This function is called in updateEventMeta.pug due to some weirdness
//in element generation. As this form is generated and not present otherwise,
//this function is best called when the form is actually created.
function updateForm() {
  $('#UpdateForm').on('submit', function(e) {
    e.preventDefault();
    $('#UpdateDeleteButton').attr("disabled", true);
    $('#UpdateUpdateButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/updateSchedule',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        $('#manual').html(res.manual);
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);           
        // alert(res.msg);
        $('#updateScheduleModal').modal('hide');
        $('#UpdateForm').trigger("reset");
      },
      error: function(res) {
        $('#UpdateDeleteButton').attr("disabled", false);
        $('#UpdateUpdateButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

//AJAX and stuff for Manual Control
function manualForm() {
  $('.manualCheckbox').each(function()
  {
    let id = (this.id).split('|')[1]
    let manualOutputDiv = '#manualOutputDiv' + id
    let manualOutputSwitch = '#manualOutputSwitch' + id
    let manualOutputValue = '#manualOutputValue_' + id
    if(!$(this).is(':checked')) {              
      $(manualOutputDiv + " *").hide()
    }
    $(this).on('change', function() {
      if(this.checked) {
        $(manualOutputDiv + " *").fadeIn()
      } else {
        $(manualOutputDiv + " *").fadeOut()
      }
    })
    $(manualOutputValue).on('change', function() {    
      if(!$(manualOutputSwitch).prop('checked')){
        $(manualOutputSwitch).prop('checked', true).trigger('change')
      }
    })     
  })  

  $('#ManualForm').submit(function(e) {
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
  
    $.ajax({
      type: 'POST',
      url: '/addManualEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        $('#manual').html(res.manual);
        $('#ManualSubmitButton').attr("disabled", false);         
        // alert(res.msg);
      },
      error: function(res) {
        $('#ManualSubmitButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

//AJAX for AddUserForm (addUser)
function addUserForm() {
  $('#AddUserForm').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var data = form.serializeArray();
    if(data[2].value != data[3].value){
      alert("Passwords do not match!")
      return
    }
    $('#AddUserSubmitButton').attr("disabled", true);
    $.ajax({
      type: 'POST',
      url: '/addUser',
      data: data,
      cache: false,
      success: function(res) {   
        $('#AddUserSubmitButton').attr("disabled", false);
        $('#AddUserForm').trigger("reset");
        location.reload()
      },
      error: function(res) {
        $('#AddUserSubmitButton').attr("disabled", false);
        if(res.status == 409) {
          alert("Username already exists!")
        }
      }
    });
  });
}

function manualFormOnChange(){
  $('#manual').find("select").on('change', function(e) {
    let outputID = $(this).attr('id').split('_')[1]
    let manualOutputSwitch = '#manualOutputSwitch' + outputID
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $('#ManualForm');
    var data = form.serializeArray();
    //If output is manually on, send POST
    if($(manualOutputSwitch).prop('checked') == true){
      $.ajax({
        type: 'POST',
        url: '/addManualEvent',
        data: data,
        cache: false,
        success: function(res) {
          $('#newScheduleModal').html(res.addEvent)
          $('#schedule').html(res.schedules);
          // $('#manual').html(res.manual);
          $('#ManualSubmitButton').attr("disabled", false);         
          // alert(res.msg);
        },
        error: function(res) {
          $('#ManualSubmitButton').attr("disabled", false);
          alert("Error on manual change.");
        }
      });
    }
  });

  $('#manual').find(":checkbox").on('change', function(e) {
    e.preventDefault();
    $('#ManualSubmitButton').attr("disabled", true);
    var form = $('#ManualForm');
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/addManualEvent',
      data: data,
      cache: false,
      success: function(res) {
        $('#newScheduleModal').html(res.addEvent)
        $('#schedule').html(res.schedules);
        // $('#manual').html(res.manual);
        $('#ManualSubmitButton').attr("disabled", false);         
        // alert(res.msg);
      },
      error: function(res) {
        $('#ManualSubmitButton').attr("disabled", false);
        alert("Error on manual change.");
      }
    });
  });
}

//AJAX for generating schedule update modal
function updateScheduleModal() {
  $('#updateScheduleModal').modal({
    keyboard: true,
    show: false
  }).on('show.bs.modal', function(){
    var data = $(event.target).closest('tr').data('scheduleid');
    var datagram = {};
    datagram.data = data;
    $.ajax({
      type: 'POST',
      url: '/getScheduleData',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#updateScheduleContent').html(res.html);
        $('#UpdateOutputDiv').hide()
        $('#UpdateWarnDiv').hide()
        $('#UpdatePythonDiv').hide()
        if(res.defaults.eventName == "Email Warn"){
          $('#UpdateWarnDiv').show()
        } else if (res.defaults.eventName == "Python Script"){
          $('#UpdatePythonDiv').show()          
        } else {
          $('#UpdateOutputDiv').show()
        }
        $('#updateScheduleContent').collapse('show');
      },
      error: function(res) {
        alert("Server could not be reached.");
      }
    });
  }).on('hidden.bs.modal', function(){
      $('#updateScheduleContent').html("Loading. . .");
      $('#updateScheduleContent').collapse('hide');
  });
};

//Conditions and schedule refresh
function dataRefresh() {
  setInterval(function() {
    let select = document.getElementById("chart_interval")
    let datagram = {interval: null}
    if(select != null){
      datagram = {interval: select.value}
    }
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#newScheduleModal').html(res.addEvent)
      },
      error: function(res) {
        console.error("Could not contact server to update charts!")
      }
    });
  }, REFRESH_INTERVAL)
};

function settings_OutputTypesForm() {

  $('#OutputTypesSelect').on('change', function() {
    let OutputType = $(this).val().split("|")[0]
    let OutputPWM = $(this).val().split("|")[1]
    let OutputPWMInversion = $(this).val().split("|")[2]

    if(OutputType == ""){
      $('#OutputTypeSubmitOld').fadeOut(400, () => {
        $('#OutputTypeSubmitNew').fadeIn()
      })
    } else {
      $('#OutputTypeSubmitNew').fadeOut(400, () => {
        $('#OutputTypeSubmitOld').fadeIn()
      })
    }


    $('#OutputTypeName').val(OutputType)
    if(OutputPWM == 1){
      $('#OutputTypePWM').prop('checked', true)
      $('#OutputTypePWMInversiondiv').fadeIn()
    } else {
      $('#OutputTypePWM').prop('checked', false)
      $('#OutputTypePWMInversiondiv').fadeOut()
    }
    if(OutputPWMInversion == 1){
      $('#OutputTypePWMInversion').prop('checked', true)
    } else {
      $('#OutputTypePWMInversion').prop('checked', false)
    }
  }).trigger("change")

  $('#OutputTypePWM').on('change', function() {
    if(this.checked == true){
      $('#OutputTypePWMInversiondiv').fadeIn()
    } else {
      $('#OutputTypePWMInversiondiv').fadeOut()
      $('#OutputTypePWMInversion').prop('checked', false)
    }
  }).trigger('change')

  $('#OutputTypeNewButton').on('click', function (){
    setSettingsOutputType('New')
  })

  $('#OutputTypeDeleteButton').on('click', function (){
    setSettingsOutputType('Delete')
  })

  $('#OutputTypeUpdateButton').on('click', function (){
    setSettingsOutputType('Update')
  })

  $('#OutputTypesForm').on('submit', function(e) {
    let mode = $('#OutputTypeMode').val()
    e.preventDefault();
    $('#OutputTypeNewButton').attr("disabled", true);
    $('#OutputTypeUpdateButton').attr("disabled", true);
    $('#OutputTypeDeleteButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    var type;
    switch (mode) {
      case 'New':
        type = "POST"
        break;
      case 'Delete':
        type = "DELETE"        
        break;
      case 'Update':
        type = "PUT"                
        break;
    
      default:
        alert('Error');
    }
    $.ajax({
      type: type,
      url: '/api/outputType',
      data: data,
      cache: false,
      success: function(res) {
        $('#OutputTypeNewButton').attr("disabled", false);
        $('#OutputTypeUpdateButton').attr("disabled", false);
        $('#OutputTypeDeleteButton').attr("disabled", false);
        $.ajax({
          type: 'GET',
          url: '/api/outputType/html',
          cache: false,
          success: function(html) {
            $('#OutputTypesSelect').html(html);
            $('#OutputTypesForm').trigger("reset");
            $('#OutputTypesSelect').trigger('change')
            $('#OutputTypePWM').trigger('change')
          }
        });
      },
      error: function(res) {
        $('#OutputTypeNewButton').attr("disabled", false);
        $('#OutputTypeUpdateButton').attr("disabled", false);
        $('#OutputTypeDeleteButton').attr("disabled", false);
        alert("Server error");
      }
    });

  })
}

function settings_OutputForm() {

  $('#OutputSelect').on('change', function() {
    let OutputName = $(this).val().split("|")[0]
    let OutputDescription = $(this).val().split("|")[1]
    let OutputOrder = $(this).val().split("|")[2]
    let OutputType = $(this).val().split("|")[3]

    if(OutputName == ""){
      $('#OutputSubmitOld').fadeOut(400, () => {
        $('#OutputSubmitNew').fadeIn()
        $('#OutputsForm').trigger('reset')
      })
    } else {
      $('#OutputSubmitNew').fadeOut(400, () => {
        $('#OutputOutputTypeSelect').val(OutputType)
        $('#OutputOrder').val(OutputOrder)
        $('#OutputDescription').val(OutputDescription)
        $('#OutputName').val(OutputName)
        $('#OutputSubmitOld').fadeIn()
      })
    }
  }).trigger("change")


  $('#OutputNewButton').on('click', function (){
    setSettingsOutput('New')
  })

  $('#OutputDeleteButton').on('click', function (){
    setSettingsOutput('Delete')
  })

  $('#OutputUpdateButton').on('click', function (){
    setSettingsOutput('Update')
  })

  $('#OutputsForm').on('submit', function(e) {
    let mode = $('#OutputMode').val()
    e.preventDefault();
    $('#OutputNewButton').attr("disabled", true);
    $('#OutputUpdateButton').attr("disabled", true);
    $('#OutputDeleteButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    var type;
    switch (mode) {
      case 'New':
        type = "POST"
        break;
      case 'Delete':
        type = "DELETE"        
        break;
      case 'Update':
        type = "PUT"                
        break;
      default:
        alert('Error');
    }
    $.ajax({
      type: type,
      url: '/api/output',
      data: data,
      cache: false,
      success: function(res) {
        $('#OutputNewButton').attr("disabled", false);
        $('#OutputUpdateButton').attr("disabled", false);
        $('#OutputDeleteButton').attr("disabled", false);
        $.ajax({
          type: 'GET',
          url: '/api/output/html',
          cache: false,
          success: function(html) {
            $('#OutputSelect').html(html);
            $('#OutputsForm').trigger("reset");
            $('#OutputSelect').trigger('change')
          }
        });
      },
      error: function(res) {
        $('#OutputNewButton').attr("disabled", false);
        $('#OutputUpdateButton').attr("disabled", false);
        $('#OutputDeleteButton').attr("disabled", false);
        alert("Server error");
      }
    });

  })
}

function settings_SensorForm() {

  $('#SensorSelect').on('change', function() {
    let SensorLocation = $(this).val().split("|")[0]
    let SensorModel = $(this).val().split("|")[1]
    let SensorType = $(this).val().split("|")[2]
    let SensorUnits = $(this).val().split("|")[3]
    let SensorHardwareID = $(this).val().split("|")[4]
    let SensorProtocol = $(this).val().split("|")[5]
    let SensorAddress = $(this).val().split("|")[6] == 'null' ? "" : $(this).val().split("|")[6]    
    if(SensorLocation == ""){
      $('#SensorSubmitOld').fadeOut(400, () => {
        $('#SensorSubmitNew').fadeIn()
        $('#SensorsForm').trigger('reset')
      })
    } else {
      $('#SensorSubmitNew').fadeOut(400, () => {
        $('#SensorTypeSelect').val(SensorType)
        $('#SensorUnits').val(SensorUnits)
        $('#SensorLocation').val(SensorLocation)
        $('#SensorModel').val(SensorModel)
        $('#SensorProtocolSelect').val(SensorProtocol)
        $('#SensorAddress').val(SensorAddress)
        $('#SensorHardwareID').val(SensorHardwareID)
        
        $('#SensorSubmitOld').fadeIn()
      })
    }
  }).trigger("change")


  $('#SensorNewButton').on('click', function (){
    setSettingsSensor('New')
  })

  $('#SensorDeleteButton').on('click', function (){
    setSettingsSensor('Delete')
  })

  $('#SensorUpdateButton').on('click', function (){
    setSettingsSensor('Update')
  })

  $('#SensorsForm').on('submit', function(e) {
    let mode = $('#SensorMode').val()
    e.preventDefault();
    $('#SensorNewButton').attr("disabled", true);
    $('#SensorUpdateButton').attr("disabled", true);
    $('#SensorDeleteButton').attr("disabled", true);

    var form = $(this);
    var data = form.serializeArray();
    var type;
    switch (mode) {
      case 'New':
        type = "POST"
        break;
      case 'Delete':
        type = "DELETE"        
        break;
      case 'Update':
        type = "PUT"                
        break;
      default:
        alert('Error');
    }
    $.ajax({
      type: type,
      url: '/api/sensor',
      data: data,
      cache: false,
      success: function(res) {
        $('#SensorNewButton').attr("disabled", false);
        $('#SensorUpdateButton').attr("disabled", false);
        $('#SensorDeleteButton').attr("disabled", false);
        $.ajax({
          type: 'GET',
          url: '/api/sensor/html',
          cache: false,
          success: function(html) {
            $('#SensorSelect').html(html);
            $('#SensorsForm').trigger("reset");
            $('#SensorSelect').trigger('change')
          }
        });
      },
      error: function(res) {
        $('#SensorNewButton').attr("disabled", false);
        $('#SensorUpdateButton').attr("disabled", false);
        $('#SensorDeleteButton').attr("disabled", false);
        alert("Server error");
      }
    });

  })
}

function settings_RestartServer(){
  $('#RestartButton').on('click', () => {
    $('#RestartButton').attr("disabled", true);
    if(confirm("Are you sure you want to restart server? This will interrupt currently running schedules.")){
      $.ajax({
        type: 'POST',
        url: '/api/server/kill',
        data: null,
        cache: false,
        success: function(res) {
          $('#RestartButton').attr("disabled", false);
        },
        error: function(res) {
          $('#RestartButton').attr("disabled", false);
          alert("Error Restarting Server.");
        }
      });
    } else {
      $('#RestartButton').attr("disabled", false);
    }
  })
}

function settings_LoginForm() {
  $('#LoginForm').on('submit', function(e) {
    e.preventDefault();
    $('#LoginSubmitButton').attr("disabled", true);
    var form = $(this);
    var data = form.serializeArray();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data,
      cache: false,
      success: function(res) {
        $('#LoginSubmitButton').attr("disabled", false);
        location.reload();
      },
      error: function(res) {
        $('#LoginSubmitButton').attr("disabled", false);
        alert("Invalid login, please try again.");
      }
    });
  })
}

// Ajax for on change of chart interval
function chartIntervalChange() {
  $('#chart_interval').on('change', function() {
    let select = document.getElementById("chart_interval")
    $('#chart_interval').attr("disabled", true);
    let datagram = {interval: select.value}
    $.ajax({
      type: 'POST',
      url: '/api/getEnvironment',
      data: datagram,
      cache: false,
      success: function(res) {
        $('#chart_interval').attr("disabled", false);
        $('#schedule').html(res.schedules);
        $('#current-conditions').html(res.currentConditions);
        $('#newScheduleModal').html(res.addEvent)
      },
      error: function(res) {
        $('#chart_interval').attr("disabled", false);
        alert("Could not update charts.");
      }
    });
  })
}

function docuReady() {
  dataRefresh()
  updateScheduleModal()
  chartIntervalChange()
}


function setScheduleDelete(){
  $('#UpdateMode').val('Delete');
}


function setScheduleUpdate(){    
  $('#UpdateMode').val('Update');
}

function setSettingsOutputType(val){    
  $('#OutputTypeMode').val(val);
}

function setSettingsOutput(val){    
  $('#OutputMode').val(val);
}

function setSettingsSensor(val){    
  $('#SensorMode').val(val);
}
function generateChart(sensorID, sensorUnits, data, sensorType){    
  let config = generateChartConfig(sensorUnits, data, sensorType)
  let ctx = document.getElementById(sensorID + '-canvas').getContext("2d");
  window.myLine = new Chart(ctx, config)
}

function generateChartConfig(sensorUnits, data, sensorType){ 
  let config = {
    type: 'line',
    data: {
      datasets: [{
        fill: false,
        label: sensorUnits, 
        data: data,
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-blue'),
      }]
    },
    options: {
      animation:{
        duration: 0
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 1
        }
      },
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-normal')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          type: "time",
          time: {
            // unit: 'hour',
            tooltipFormat: 'h:mm A'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green')
          },
          gridLines: {
            drawBorder: false,
            color: getComputedStyle(document.documentElement).getPropertyValue('--website-bg-normal')
          },
          scaleLabel: {
            fontColor: getComputedStyle(document.documentElement).getPropertyValue('--website-text-green'),
            display: true,
            labelString: sensorUnits
          }
        }]
      }
    }
  }
  switch (sensorType) {
    case 'Temperature':
      if (sensorUnits == "°C" || sensorUnits == "C") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 10     
        config.options.scales.yAxes[0].ticks.suggestedMax = 27
      } else if (sensorUnits == "°F" || sensorUnits == "F") {
        config.options.scales.yAxes[0].ticks.suggestedMin = 50     
        config.options.scales.yAxes[0].ticks.suggestedMax = 80
      }
      break;
    case 'Humidity':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 40     
      config.options.scales.yAxes[0].ticks.suggestedMax = 60
      break;
    case 'Pressure':      
      config.options.scales.yAxes[0].ticks.suggestedMin = 99     
      config.options.scales.yAxes[0].ticks.suggestedMax = 102
      break;
    case 'CarbonDioxide':      
      break;
  
    default:
      break;
  }
  return config
}

//Anchor scroll
$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
  }, 500);
});