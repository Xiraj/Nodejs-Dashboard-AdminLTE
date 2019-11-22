var express = require('express');
var router = express.Router();


/* GET Supplier page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = ('SELECT * FROM supplier');
		connection.query(query,	function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('supplier/list',{title:"Suppliers",data:rows});
		});
         //console.log(query.sql);
     });
});

router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var supplier = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from supplier where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/suppliers');
				}
				else{
					req.flash('msg_info', 'Delete supplier Success'); 
					res.redirect('/suppliers');
				}
			});
		});
	});
});
router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/suppliers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Supplier can't be find!"); 
					res.redirect('/suppliers');
				}
				else
				{	
					console.log(rows);
					res.render('supplier/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
        v_kode = req.sanitize( 'kode' ).escape().trim();
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
		v_telepon = req.sanitize( 'telepon' ).escape();

		var supplier = {
            kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
			email: v_email,
			telepon : v_telepon
		}

		var update_sql = 'update supplier SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/edit', 
					{ 
						kode: req.param('kode'),
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						email: req.param('email'),
						telepon: req.param('telepon'),
					});
				}else{
					req.flash('msg_info', 'Update supplier success'); 
					res.redirect('/suppliers/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}
});

router.post('/add', function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_kode = req.sanitize( 'kode' ).escape().trim();
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
		v_telepon = req.sanitize( 'telepon' ).escape();

		var supplier = {
            kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
			email: v_email,
			telepon : v_telepon
		}

		var insert_sql = 'INSERT INTO supplier SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/add-supplier', 
					{ 
						kode: req.param('kode'),
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						email: req.param('email'),
						telepon: req.param('telepon'),
					});
				}else{
					req.flash('msg_info', 'Create supplier success'); 
					res.redirect('/suppliers');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'supplier/add-supplier', 
	{ 
		title: 'Add New supplier',
		kode: '',
		nama: '',
		alamat: '',
		email: '',
		telepon: '',
	});
});

module.exports = router;