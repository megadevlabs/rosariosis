//Modules.php JS
var locked;
function addHTML(html,id,replace){
	if(locked!=false){
		if(replace==true) document.getElementById(id).innerHTML = html;
		else document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + html;
	}
}
function checkAll(form,value,name_like){
	var checked = (value==true)?true:false;

	for(i=0;i<form.elements.length;i++){
		if(form.elements[i].type=='checkbox' && form.elements[i].name!='controller' && form.elements[i].name.substr(0,name_like.length)==name_like)
			form.elements[i].checked = checked;
	}
}
function switchMenu(id){
	if(document.getElementById(id).style.display=='none'){
		document.getElementById(id).style.display = 'block';
		document.getElementById(id+'_arrow').src = 'assets/arrow_down.gif';
		document.getElementById(id+'_arrow').height = 9;
	}else{
		document.getElementById(id).style.display = 'none';
		document.getElementById(id+'_arrow').src = 'assets/arrow_right.gif';
		document.getElementById(id+'_arrow').height = 12;
	}
}

//tipmessage
var TipId="Migoicons";var FiltersEnabled = 0;
var tipmessageStyle = ["#21759b","#ececec","","","Georgia,Times New Roman",,"#555","#f9f9f9","","","sans-serif",,,,2,"#ececec",2,,,,,"",,,0,23];

//touchScroll, enables overflow:auto on mobile
//https://gist.github.com/chrismbarr/4107472
function touchScroll(el){
	var scrollStartPosY=0;
	var scrollStartPosX=0;

	el.addEventListener("touchstart", function(event) {
		scrollStartPosY=this.scrollTop+event.touches[0].pageY;
		scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
	},false);

	el.addEventListener("touchmove", function(event) {
		if ((this.scrollTop < this.scrollHeight-this.offsetHeight &&
			this.scrollTop+event.touches[0].pageY < scrollStartPosY-5) ||
			(this.scrollTop != 0 && this.scrollTop+event.touches[0].pageY > scrollStartPosY+5))
				event.preventDefault(); 
		if ((this.scrollLeft < this.scrollWidth-this.offsetWidth &&
			this.scrollLeft+event.touches[0].pageX < scrollStartPosX-5) ||
			(this.scrollLeft != 0 && this.scrollLeft+event.touches[0].pageX > scrollStartPosX+5))
				event.preventDefault(); 
		this.scrollTop=scrollStartPosY-event.touches[0].pageY;
		this.scrollLeft=scrollStartPosX-event.touches[0].pageX;
	},false);
}
function isTouchDevice(){
	try{
		document.createEvent("TouchEvent");
		return true;
	}catch(e){
		return false;
	}
}

function ajaxLink(link){	
	//will work only if in the onclick there is no error!
	var target = link.target;
	if (link.href.indexOf('#')!=-1 || target=='_blank' || target=='_top') //internal/external/index.php anchor
		return true;
	if (!target)
	{
		if (link.href.indexOf('Modules.php')!=-1)
			target = 'body';
		else
			return true;
	}
	$.get(link.href, function(data){
		ajaxSuccess(data,target,link.href);
	})
	.fail(function(x,st,err){
		alert("ajaxLink get Status: "+st+" - Error: "+err);
    });
	return false;
}

function ajaxPostForm(form,submit){
	var target = form.target;
	if (!target)
			target = 'body';
	if (form.action.indexOf('_ROSARIO_PDF')!=-1) //print PDF
	{
		form.target = '_blank';
		return true;
	}
	var options = {
		success: function(data){
			ajaxSuccess(data,target,form.action);
		},
		error: function(x,st,err){
			alert("ajaxPostForm get Status: "+st+" - Error: "+err);
		}
	};
	if (submit)
		$(form).ajaxSubmit(options);
	else
		$(form).ajaxForm(options);
	return false;
}

var successURL;
function ajaxSuccess(data,target,url){
	//change URL after AJAX
	//http://stackoverflow.com/questions/5525890/how-to-change-url-after-an-ajax-request#5527095
	$('#'+target).html(data);
	document.title = $('#body h2').first().text();
	var body = $('body').html();
	if (body.length<640000)//640K chars limit
	{
		if (window.location.href == url)
			history.replaceState({data:body}, '', url);
		else if (target == 'body')
			history.pushState({data:body}, '', successURL = oldURL = url);
		else if (successURL == oldURL)//target == menu || footer
			history.replaceState({data:body}, '', oldURL);
	}
	ajaxPrepare('#'+target);
}

//change URL after AJAX
$(window).bind('popstate', function (e) {
    var state = e.originalEvent.state;
	var docURL = oldURL = document.URL;
	if (!state)//640K chars limit
		return document.location.href = docURL;
    $('body').html(state.data);
	document.title = $('#body h2').first().text();
	ajaxPrepare('body');
	openMenu((modnamepos = docURL.indexOf('modname=')) != -1 ? docURL.substr(modnamepos+8, docURL.length) : 'default');
});

function ajaxPrepare(target){
	$(target+' form').each(function(){ ajaxPostForm(this,false); });
	$(target+' a').click(function(e){ if(disableLinks){e.preventDefault(); return false;} return ajaxLink(this); });
	scroll();
	if (scrollTop=='Y')
		$('html, body').animate({scrollTop:$('#body').offset().top - 20});
}

//disable links while AJAX
var disableLinks = false;
$(document).ajaxStart(function(){
	disableLinks = true;
	$('input[type="submit"],input[type="button"]').disabled;
});
$(document).ajaxStop(function(){
	disableLinks = false;
	$('input[type="submit"],input[type="button"]').enabled;
});

//onload
var oldURL;
window.onload = function(){
	if (typeof(mig_clay) == "function")
		mig_clay();
	scroll();
	$('a').click(function(e){ if(disableLinks){e.preventDefault(); return false;} return ajaxLink(this); });
	$('form').each(function(){ ajaxPostForm(this,false); });
	var docURL = oldURL = document.URL;
	//reloaded page
	if ((modnamepos = docURL.indexOf('modname=')) != -1)
		openMenu(docURL.substr(modnamepos+8, docURL.length));
};
function scroll(){
	if (isTouchDevice())
	{
		var els = document.getElementsByClassName('rt');
		Array.prototype.forEach.call(els, function(el) {
			touchScroll(el.tBodies[0]);
		});
	}
}
if (isTouchDevice())
	$(document).bind("cbox_complete", function(){ touchScroll(document.getElementById("cboxLoadedContent")); });


//Side.php JS
var old_modcat = false;
function openMenu(modname)
{
	if (modname!='default')
	{
		var modcat = modname.substr(0, modname.indexOf('/'));
		if (!(visible = document.getElementById("menu_"+modcat)))
			visible = document.getElementById("menu_"+(modcat = old_modcat));
		visible.style.display = "block";
		if(old_modcat!=false && old_modcat!=modcat)
			$("#menu_"+old_modcat).hide();
		old_modcat = modcat;
		selMenuA(modname);
	}
	else if(old_modcat!=false)
		$("#menu_"+old_modcat).hide();
}
function selMenuA(modname)
{
	if (oldA = document.getElementById("selectedMenuLink"))
		oldA.id = "";
	$('#adminmenu a[href$="'+modname+'"][class!="menu-top"]:first').each(function(){this.id = "selectedMenuLink";});
	//add selectedModuleLink
	if (oldA = document.getElementById("selectedModuleLink"))
		oldA.id = "";
	var modcat = modname=='' ? old_modcat : modname.substr(0, modname.indexOf('/'));
	$('#adminmenu a[href*="'+modcat+'"].menu-top').each(function(){this.id = "selectedModuleLink";});
}

//Bottom.php JS
var modname='default', old_modname='';
function expandHelp(){
var heightFooter = (document.getElementById('footer').style.height=='178px')?'38px':'178px';
	if (heightFooter=='178px')
	{
		if (modname!=old_modname)
		{
			$.get("Bottom.php?modfunc=help&modname="+modname, function(data){
				$('#footerhelp').html(data);
				if (isTouchDevice())
					touchScroll(document.getElementById('footerhelp'));
			})
			.fail(function(){
				alert('Error: expandHelp '+modname);
			})
			old_modname = modname;
		}
		$('#footerhelp').show();
	}
	else
		$('#footerhelp').hide();
	document.getElementById('footer').style.height = heightFooter;
}
function expandMenu(){
	$('#menu,#menuback').toggle();
}