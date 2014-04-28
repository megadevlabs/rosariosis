<?php
	switch(User('PROFILE'))
	{
		case 'admin':
			$title = _('Administrator');
		break;

		case 'teacher':
			$title = _('Teacher');
		break;

		case 'parent':
			$title = _('Parent');
		break;
		
		case 'student':
			$title = _('Student');
		break;
	}

	$handle = PDFStart();
	echo '<TABLE><TR><TD><IMG SRC="assets/themes/'.Preferences('THEME').'/logo.png" /></TD><TD><h1>'.sprintf(_('%s Handbook'),$title).'</h1></TD></TR></TABLE><HR>';

	foreach($help as $program=>$value)
	{
		if(mb_strpos($program,'/'))
		{
			$modcat = str_replace('_',' ',mb_substr($program,0,mb_strpos($program,'/')));
			
			if (!$RosarioModules[str_replace(' ','_',$modcat)]) //module not activated
				break;
		
			if($modcat!=$old_modcat)
				echo '<div style="page-break-after: always;"></div><TABLE><TR><TD><h2><IMG SRC="assets/icons/'.str_replace(' ','_',$modcat).'.png" class="headerIcon" /> '._($modcat).'</h2></TD></TR></TABLE><HR>';
			$old_modcat = $modcat;
		}
		$_REQUEST['modname'] = $program;
		echo '<h3>';
		if($program=='default')
			echo ParseMLField(Config('TITLE')).' - '.sprintf(_('%s Handbook'),$title).'<BR />'.sprintf(_('version %s'),'1.0');
		else
			echo (ProgramTitle() == 'RosarioSIS' ? str_replace(' ','_',$program) : ProgramTitle());
		echo '</h3>';
		echo '<TABLE class="width-100p cellpadding-5"><TR><TD class="header2">';
		if($student==true)
			$value = str_replace('your child','yourself',str_replace('your child\'s','your',$value));
		echo $value;
		echo '</TD></TR></TABLE><BR />';
	}
	PDFStop($handle);
?>