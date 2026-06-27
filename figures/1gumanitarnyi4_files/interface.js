$(function()
{

$('body').on('click', 'div.black_checkbox', function(){ $(this).checkToggle(); });

// Чекбокс
$.fn.checkToggle = function(callback)
{
  if ($(this).hasClass('checkbox_checked'))
  {
      $(this).removeClass('checkbox_checked');
      $(this).addClass('checkbox_unchecked');
      if (callback){ callback(false) };
  }
  else
  {
      $(this).removeClass('checkbox_unchecked');
      $(this).addClass('checkbox_checked');
      if (callback){ callback(true) };
  };
};

$.fn.setChecked = function(callback)
{
    $(this).removeClass('checkbox_unchecked');
    $(this).addClass('checkbox_checked');
    if (callback){ callback(true) };
};

$.fn.setUnchecked = function(callback)
{
    $(this).removeClass('checkbox_checked');
    $(this).addClass('checkbox_unchecked');
    if (callback){ callback(false) };
};

$.fn.checked = function()
{
    var checked_state = false;
    if ($(this).hasClass('checkbox_checked')){ checked_state = true; };
    return checked_state;
};


// Дата и время
$.fn.getDateTime = function(dtype)
{
    var current_datetime_input = $(this);
    var selected_day = current_datetime_input.data('day');
    var selected_month = current_datetime_input.data('month');
    var selected_year = current_datetime_input.data('year');
    var selected_hour = current_datetime_input.data('hour');
    var selected_min = current_datetime_input.data('min');

    var init_date = new Date();

    if (selected_day != '00' && selected_day != 'undefined' && selected_month != '00' && selected_month != 'undefined' && selected_year != '0000' && selected_year != 'undefined')
    {
        if (selected_hour == undefined) { selected_hour = '00'; };
        if (selected_min == undefined) { selected_min = '00'; };
        var init_date = new Date(selected_year, selected_month-1, selected_day, selected_hour, selected_min, 0, 0);
    };

    var markup = [
    	'<div id="dialog_overlay">',
    	'<div id="datetime_dialog_window" class="modal_window">',
    	'<div id="dialog_body"><div id="datepicker_block"></div></div>',
    	'<div class="dialog_buttons"><div class="dialog_button dialog_blue_button" style="width: 50%" id="params_modal_ok">ОК</div><div class="dialog_button dialog_black_button" style="width: 50%" id="params_modal_cancel">ОТМЕНА</div></div>',
    	'</div></div>'
    ].join('');

    function format_num(num, size) { var s = num + ''; while (s.length < size){ s = '0' + s }; return s; };

    $(markup).hide().appendTo('body');
    var windowHeight = $(window).height();
    $('#datetime_dialog_window').css('top', current_datetime_input.offset().top+40);
    $('#datetime_dialog_window').css('left', current_datetime_input.offset().left);
    $('#dialog_overlay').velocity("fadeIn", {duration: 100});

    $('#datepicker_block').datepicker({
        onSelect: function onSelect(selected_fmt_date, selected_date)
        {
           selected_hour = format_num(selected_date.getHours(), 2);
           selected_min = format_num(selected_date.getMinutes(), 2);
           selected_day = format_num(selected_date.getDate(), 2);
           selected_month = format_num(selected_date.getMonth()+1, 2);
           selected_year = selected_date.getFullYear();
        }
    });

    var curr_datepicker = $('#datepicker_block').datepicker().data('datepicker');
    curr_datepicker.selectDate(init_date);


    $('#params_modal_ok').click(function()
    {
        current_datetime_input.data('day', selected_day);
        current_datetime_input.data('month', selected_month);
        current_datetime_input.data('year', selected_year);
        current_datetime_input.data('hour', selected_hour);
        current_datetime_input.data('min', selected_min);

        if (dtype=='datetime')
        {
            current_datetime_input.children('div.datetime_input_text').html(selected_day + '.' + selected_month + '.' + selected_year + ' ' + selected_hour + ':' +selected_min);
        }
        else
        {
            current_datetime_input.children('div.datetime_input_text').html(selected_day + '.' + selected_month + '.' + selected_year);
        };

        $.hideDateTimePicker();
        return false;
    });

    $('#params_modal_cancel').click(function()
    {
        $.hideDateTimePicker();
        return false;
    });

};

$.hideDateTimePicker = function(){ $('#dialog_overlay').velocity("fadeOut", {duration: 100, complete: function(){$(this).remove();} }); };
$('div.datetime_input').click(function(){ $(this).getDateTime('date'); });

$.fn.setDateTime = function(setDay, setMonth, setYear, setMin, setHour)
{
    $(this).data('day', setDay);
    $(this).data('month', setMonth);
    $(this).data('year', setYear);
    $(this).data('hour', setMin);
    $(this).data('min', setHour);
    if (setYear == '1900') { $(this).children('div.datetime_input_text').html('--'); } else { $(this).children('div.datetime_input_text').html(setDay + '.' + setMonth + '.' + setYear); };
};




// Диалог
$.appDialog = function(params)
{
    if($('#dialog_overlay').length){ return false; };

    var buttonHTML = '';

    var button_index = 0;
    $.each(params.buttons, function(name, obj)
    {
        button_index++;
        buttonHTML += '<div class="dialog_button ' + obj['class'] + '" id="dlg_button_' + button_index + '">' + name + '</div>';
        if(!obj.action){ obj.action = function(){}; };
    });

    var markup = [
    	'<div id="dialog_overlay">',
    	'<div id="dialog_window" class="modal_window">',
    	'<div id="dialog_text">',params.message,'</div>',
    	'<div class="dialog_buttons">',buttonHTML,'</div>',
    	'</div></div>'
    ].join('');

    $(markup).hide().appendTo('body');
    var windowHeight = $(window).height();
    $('#dialog_overlay').show();
    var dialogHeight = $('#dialog_window').height();
    $('#dialog_overlay').hide();
    var dialog_top = Math.round(windowHeight/2 - dialogHeight/2);
    $('#dialog_window').css('top', dialog_top+'px');
    $('#dialog_overlay').velocity("fadeIn", {duration: 100});

    var buttons = $('div.dialog_buttons div.dialog_button');
    var i = 0; $.each(params.buttons,function(name,obj){ buttons.eq(i++).click(function(){ obj.action(); $.appDialog.hide(); return false; }); });
};
$.appDialog.hide = function()
{
	$('#dialog_overlay').velocity("fadeOut", {duration: 100, complete: function(){$(this).remove();} });
};




// комбобокс
$('body').on('click', 'div.combobox_selected_item', function(){ $(this).parent('div.white_combobox').children('div.combobox_popup_items').toggle(); });
$('body').on('click', 'div.combobox_item', function()
{
    var selected_id = $(this).data('id');
    var selected_text = $(this).html();
    $(this).parent('div.combobox_popup_items').parent('div.white_combobox').data('selected', selected_id);
    $(this).parent('div.combobox_popup_items').parent('div.white_combobox').children('div.combobox_selected_item').children('div.combobox_selected_text').html(selected_text);
    $(this).parent('div.combobox_popup_items').toggle();
    var combodox_change = $(this).parent('div.combobox_popup_items').parent('div.white_combobox').data('onchange');
    if(combodox_change != undefined){ window[String(combodox_change)](selected_id); };
});

$.fn.setValue = function(value_id)
{
    var value_found = false;
    var current_combobox = $(this);
    var combobox_items = $(this).children('div.combobox_popup_items').children('div.combobox_item');
    for(var i=0; i < combobox_items.length; i++)
    {
        var combobox_item = $(combobox_items[i]);
        if (combobox_item.data('id') == value_id)
        {
            current_combobox.data('selected', combobox_item.data('id'));
            current_combobox.children('div.combobox_selected_item').children('div.combobox_selected_text').html(combobox_item.html());
            value_found = true;
        };
    };

    if (!value_found)
    {
        current_combobox.data('selected', 0);
        current_combobox.children('div.combobox_selected_item').children('div.combobox_selected_text').html('--');
    };
};

});