<?php 


$username = $_POST['username'];

echo json_encode(array('status'=>1,'msg'=>$username.'未存在'));

