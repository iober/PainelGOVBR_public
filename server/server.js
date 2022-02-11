const
  express = require('express'),
  app = express(),
  request = require('request'),
  cheerio = require('cheerio'),
  mysql = require('mysql'),
  cors = require('cors'),
  axios = require('axios'),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3000
app.set('port', port)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

'use strict'
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

// Disparo de e-mmail dos post-it
setInterval(function () {
  http.get('http://linkapi.com')
  var Xmas95 = new Date()
  if (Xmas95.getHours() === 08) {
    if (Xmas95.getMinutes() >= 00 && Xmas95.getMinutes() < 30) {
      http.get('http://linkapi.com/emailLembrete')
    }
  }
}, 100000) // 25 min

// conexao com o banco no mysql localhost
var con = mysql.createPool({
  user: '',
  password: '',
  host: '',
  database: '',
  port: 3306 
})
app.get('/emailLembrete/', function (req, res) {
  var email = ''
  var dm = new Date()
  var d, m = ''
  d = (dm.getDate().toString().length=== 1) ? '0' + dm.getDate() : dm.getDate()
  m = (dm.getMonth().toString().length=== 1) ? '0' + (dm.getMonth() +1) : dm.getMonth() +1
  var dtok = dm.getFullYear() + '-' + m + '-' + d
  var sql = 'SELECT idCard, tituloCard, dsCard,  dtCard, emailuser FROM cards WHERE envioEmail = 0 AND dtCard = "' + dtok + '"'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    } else {
      result.forEach((element, index) => {

      // NÃO FINALIZADO
      async function main () {
        let transporter = nodemailer.createTransport({
          host: '', // Office 365 server
          port: 587,
          secure: false,
          auth: {
            user: "",
            pass: "*"
          },
          tls: {
            ciphers: 'SSLv3'
          }
        })
        var mailOptions = {
          from: '"Painel GOVBR" <email@email.com.br>', // sender address
          to: email, // list of receivers
          subject: 'LEMBRETE: ' + result[index].tituloCard.toUpperCase(), // Subject line
          text: 'LEMBRETE - PAINEL GOVBR', // plain text body
          html: '<b>LEMBRETE:</b><br><i> ' + result[index].tituloCard + 
          '</i><br><br><b>Descrição:</b><br><i> ' + result[index].dsCard
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
       }
       var sql2 = 'UPDATE cards SET envioEmail = "99" WHERE idCard = "' + result[index].idCard + '"'
        con.query(sql2, function (err, result) {
          if (err) {
            console.log(err.stack)
          }
        })
      main().catch(console.error)
      })
    }
  })
})

app.post('/rel/', function (req, res) {
  var dados = req.body
  var obj = []
  var sql = 'SELECT d.nmCliente, a.seqAcp, SUBSTRING(a.dtAcp, 4,8) dtAcp, ca.chamados, ca.sistemas, replace(ca.descricaoAcp, "	", " ") AS descricaoAcp ' +
            'FROM acp a, dadosClientes d, chamadosAcp ca WHERE ca.idCliente=? and ca.anoAcp=? and d.idCliente = a.idCliente and a.execAcp > 0 ' +
            'and ca.idCliente = a.idCliente and ca.anoAcp = a.anoAcp and a.seqAcp = ca.seqAcp order by a.seqAcp ASC'
  con.query(sql, [dados.idCliente, dados.anoAcp], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    for (const i in result) {
      obj.push({ 'dtAcp': result[i].dtAcp, 'sistemas': result[i].sistemas, 'chamados': result[i].chamados, 'descricao': result[i].descricaoAcp })
    }
    res.send(obj)
  })
})

app.post('/relFiltro/', function (req, res) {
  var dados = req.body
  var dti = dados.dti.substring(6, 10) + '-' + dados.dti.substring(3, 5) + '-' + dados.dti.substring(0, 2)
  var dtf = dados.dtf.substring(6, 10) + '-' + dados.dtf.substring(3, 5) + '-' + dados.dtf.substring(0, 2)
  var sql = 'SELECT t1.idcliente,  ' +
' t1.nmCliente, ' +
' t1.total, ' +
'  t1.executadas, ' +
'  t1.previstas,  ' +
'  t1.previstas - t1.executadas AS saldo ' +
' FROM   (SELECT dc.idcliente, dc.nmCliente,  ' +
'  (SELECT SUM(a.qtAcp) ' +
'   FROM acp AS a ' +
'    WHERE a.idcliente = dc.idcliente ' +
'	   AND STR_TO_DATE(dtAcp, "%d/%m/%Y") BETWEEN "' + dti + '" AND "' + dtf + '"  ' +
'  ) AS total, ' +
'   (SELECT SUM(a.qtAcp)  ' +
'       FROM acp AS a  ' +
'        WHERE a.idcliente = dc.idcliente  ' +
'   AND STR_TO_DATE(dtAcp, "%d/%m/%Y") BETWEEN "' + dti + '" AND "' + dtf + '"  ' +
' ) AS previstas, ' +
' (SELECT sum(execAcp)  ' +
'        FROM acp AS a  ' +
'        WHERE a.idcliente = dc.idcliente ' +
'			 AND STR_TO_DATE(dtAcp, "%d/%m/%Y") BETWEEN "' + dti + '" AND "' + dtf + '"  ' +
'  ) AS executadas,  ' +
'  (SELECT anoAcp  ' +
'   FROM acp AS a  ' +
'   WHERE  a.idcliente = dc.idcliente  ' +
'    AND STR_TO_DATE(dtAcp, "%d/%m/%Y") BETWEEN "' + dti + '" AND "' + dtf + '"  ' +
'	 LIMIT 1  ' +
' ) AS anoacp  ' +
'      FROM  dadosClientes AS dc ' +
' ) AS t1 '
  if (dados.where) {
    sql = sql + '' + dados.where
  } else {
    sql = sql + ' order by t1.nmcliente '
  }
  con.query(sql, [dti, dtf], function (err, result) {
    if (err) {
      console.log(err.stack)
    } else {
      res.send(result)
    }
  })
})

app.post('/relGeral/', function (req, res) {
  var dados = req.body
  var sql = 'SELECT t1.idcliente, ' +
  't1.nmCliente,' +
  ' t1.total,' +
  ' t1.executadas,' +
  ' t1.previstas, ' +
  ' t1.previstas - t1.executadas AS saldo ' +
  'FROM   (SELECT dc.idcliente, dc.nmCliente, ' +
  ' (SELECT SUM(a.qtAcp)' +
  '  FROM acp AS a' +
  '   WHERE a.idcliente = dc.idcliente ' +
  'AND a.statusAcp = "A" ' +
  ' ) AS total,' +
  '  (SELECT SUM(a.qtAcp) ' +
  '      FROM acp AS a ' +
  '       WHERE a.idcliente = dc.idcliente ' +
  '  AND a.statusAcp = "A"' +
  '  AND substring(STR_TO_DATE(dtAcp, "%d/%m/%Y"), 1, 7) <= CONCAT(DATE_FORMAT(CURDATE(), "%Y-%m")) ' +
  ') AS previstas, ' +
  '(SELECT sum(execAcp) ' +
  '       FROM acp AS a ' +
  '       WHERE a.idcliente = dc.idcliente ' +
  '  AND a.statusAcp = "A" ' +
  ' ) AS executadas, ' +
  ' (SELECT anoAcp ' +
    ' FROM acp AS a ' +
    ' WHERE  a.idcliente = dc.idcliente ' +
    ' AND a.statusAcp = "A" LIMIT 1 ' +
 ' ) AS anoacp ' +
  '     FROM   dadosClientes AS dc ' +
  ') AS t1  '
  if (dados.where) {
    sql = sql + '' + dados.where
  } else {
    sql = sql + ' order by t1.nmcliente '
  }
  con.query(sql, [dados.idCliente, dados.anoAcp], function (err, result) {
    if (err) {
      console.log(err.stack)
    } else {
      res.send(result)
    }
  })
})

// retorna todos os resultados da tabela
app.get('/clientes', function (req, res) {
  var sql = 'select * from dadosClientes order by nmCliente'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

// insere cadastro no banco
app.post('/cadCliente', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO dadosClientes SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// busca via id
app.get('/cadCliente/:id', function (req, res) {
  con.query('select nmCliente from dadosClientes where idCliente=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// deleta cadastro
app.delete('/cadCliente/:id', function (req, res) {
  con.query('delete from dadosClientes where idCliente=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// altera dados do cadastro
app.put('/cadCliente/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE dadosClientes set nmCliente =?, codTce =?, endComunicador =?, endTransparencia =?, endCidadao = ?, endNfse = ?, endDeiss =?, endLcon=? WHERE idCliente = ?'
  con.query(sql, [dados.nmCliente, dados.codTce, dados.endComunicador, dados.endTransparencia, dados.endCidadao,
    dados.endNfse, dados.endDeiss, dados.endLcon, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// ---------------------- AQUI INICIA O CRUD DOS CARDS -----------------
app.get('/cards/:id', function (req, res) {
  con.query('select *, DATE_FORMAT(dtCard, "%d/%m/%Y") as dtCard from cards where idUser=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.post('/cadCards', function (req, res) {
  var dados = req.body
  if (dados.dtCard){
    dados.dtCard = dados.dtCard.substring(6, 10) + '-' + dados.dtCard.substring(3, 5) + '-' + dados.dtCard.substring(0, 2)
  }
  con.query('INSERT INTO cards SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/delCard/:id', function (req, res) {
  con.query('delete from cards where idCard=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/alteraCor/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE cards set corCard =? WHERE idCard = ?'
  con.query(sql, [dados.cor, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/alteraCard/:id', function (req, res) {
  var dados = req.body
  dados.dtCard = dados.dtCard.substring(6, 10) + '-' + dados.dtCard.substring(3, 5) + '-' + dados.dtCard.substring(0, 2)
  var sql = 'UPDATE cards set tituloCard =? , dsCard =?, dtCard=?, envioEmail=? WHERE idCard = ?'
  con.query(sql, [dados.tituloCard, dados.dsCard, dados.dtCard, dados.envioEmail, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.post('/log', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO log SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// ---------------------- AQUI TERMINA O CRUD DOS CARDS -----------------//
// ------------------- AQUI COMEÇA O CRUD DO PLANEJAMENTO-------------------//

app.get('/clientesSelect', function (req, res) {
  var sql = 'select idCliente, nmCliente from dadosClientes order by nmCliente Asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/clientesSelectAcp', function (req, res) {
  var sql = 'select DISTINCT dc.idCliente, dc.nmCliente from dadosClientes dc, acp a WHERE dc.idCliente = a.idCliente and a.statusAcp = "A" order by dc.nmCliente asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

var emails = []
// insere cadastro da demanda no banco
app.post('/cadDemanda', function (req, res) {
  var dados = req.body
  emails = dados.emails

  con.query('INSERT INTO demandas SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
  // eslint-disable-next-line no-unused-expressions
  async function main () {
    let transporter = nodemailer.createTransport({
      host: '', // Office 365 server
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "*"
      },
      tls: {
        ciphers: 'SSLv3'
      }
    })
    var mailOptions = {
      from: '"Painel GOVBR" <email@email.com>', // sender address
      to: emails + gestAcp, // list of receivers
      subject: 'NOVA DEMANDA INCLUÍDA - ', // Subject line
      text: 'Informativo - Painel GOVBR', // plain text body
      html: '<table style="text-align: center;" cellspacing="0">' +
                '  <thead style="background-color:#0560a1; color: azure;">' +
                '    <th style="border-right: 1px solid azure">CLIENTE</th>' +
                '    <th style="border-right: 1px solid azure">EQUIPE</th>' +
                '    <th style="border-right: 1px solid azure">ASSUNTO</th>' +
                '    <th style="border-right: 1px solid azure">PRIORIDADE</th>' +
                '    <th style="border-right: 1px solid azure">RESPONSÁVEL</th>' +
                '  </thead>' +
                '  <tr>' +
                '      <td width="200" style="border: 1px solid #0560a1;">' +
                '          <b>' + dados.nmClienteDemanda.toUpperCase() + '</b>' +
                '      </td>' +
                '      <td width="120" style="border: 1px solid #0560a1;">' +
                '        <b>' + dados.sistema.toUpperCase() + '</b>' +
                '      </td>' +
                '      <td width="400" style="border: 1px solid #0560a1;">' +
                '        <b>' + dados.resumo.toUpperCase() + '</b>' +
                '      </td>' +
                '      <td width="120" style="border: 1px solid #0560a1;">' +
                '        <b>' + dados.prioridade.toUpperCase() + '</b>' +
                '    </td>' +
                '      <td width="120" style="border: 1px solid #0560a1;">' +
                '        <b>' + dados.usuario.toUpperCase() + '</b>' +
                '    </td>' +
                '    </tr>' +
                '</table>' +
                '<p>E-mail enviado automáticamente via Painel GOVBR.</p><br>' +
                '<a href="https://sitedemo.com.br">Acessar Painel GOVBR</a>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
  main().catch(console.error)
})

// retorna todos os resultados da tabela
app.get('/demandas/', function (req, res) {
  var sql = 'select * from demandas where status in ("A", "I")'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/compartilhada/:id', function (req, res) {
  var sql = 'select sistema, nmClienteDemanda, prioridade, previsao, resumo, atividade, observacoes, dataInclusao, usuario, dataprevisao from demandas where status in ("A", "I") and idDemanda=' + req.params.id
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

// retorna as demandas que ja foram concluidas ou inativadas
app.get('/demandasConcluidas/', function (req, res) {
  var sql = 'select * from demandas where status = "C"'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

// retorna todos os resultados da tabela por sistema
app.get('/demandas/:id', function (req, res) {
  var sql = 'select dadosClientes.idCliente, dadosClientes.nmCliente, demandas.* from demandas, dadosClientes where demandas.idCliente = dadosClientes.idCliente and demandas.status in ("A", "I") and demandas.sistema like "%' + req.params.id + '%"'
  con.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.delete('/demanda/:id', function (req, res) {
  con.query('delete from demandas where idDemanda=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/demanda/:id', function (req, res) {
  var dados = req.body
  if (dados.sistema[1] === undefined) {
    dados.sistema = dados.sistema[0]
  } else {
    dados.sistema = dados.sistema[0] + ', ' + dados.sistema[1]
  }
  var sql = 'UPDATE demandas SET sistema=?,idCliente=?, nmClienteDemanda=?,prioridade=?,previsao=?,resumo=?,atividade=?,observacoes=? WHERE idDemanda=?'
  con.query(sql, [dados.sistema, dados.idCliente, dados.nmClienteDemanda, dados.prioridade, dados.previsao, dados.resumo, dados.atividade, dados.observacoes, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// conclui demanda
app.put('/confirmaDemanda/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE demandas SET status="C", nrChamado=?, dataConclusao=? WHERE idDemanda=?'
  con.query(sql, [dados.nrChamado, dados.dataConclusao, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/inativaDemanda/:id', function (req, res) {
  var sql = 'UPDATE demandas SET status="I" WHERE idDemanda=?'
  con.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// restaura demanda ja concluida ou inativada
app.put('/restauraDemanda/:id', function (req, res) {
  var sql = 'UPDATE demandas SET status="A" WHERE idDemanda=?'
  con.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// ---------------------- AQUI TERMINA O CRUD DE DEMANDAS -----------------//
// ------------------- AQUI COMEÇA O CRUD DO VISITAS-------------------//
app.get('/visitas/', function (req, res) {
  var sql = 'select dc.idCliente, dc.nmCliente, v.* from visitas v, dadosClientes dc where v.status = "A" and v.idCliente = dc.idCliente order by v.dtVisita asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/todasVisitas/', function (req, res) {
  var sql = 'select dc.idCliente, dc.nmCliente, v.* from visitas v, dadosClientes dc where v.idCliente = dc.idCliente order by v.dtVisita asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/visitas/:id', function (req, res) {
  var sql = 'select dc.idCliente, dc.nmCliente, v.* from visitas v, dadosClientes dc where v.idCliente = dc.idCliente and v.tpVisita =? order by dtVisita asc'
  con.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.delete('/delVisita/:id', function (req, res) {
  con.query('delete from visitas where idVisita=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.post('/cadVisita', function (req, res) {
  var dados = req.body
  dados.dtVisita = dados.dtVisita.split(/\D/).reverse().join('-')
  atualizar()
  function atualizar () {
    con.query('UPDATE visitas SET status="I" WHERE idCliente=? and tpVisita=?', [dados.idCliente, dados.tpVisita], function (error, results, fields) {
      if (error) throw error
      res.end(JSON.stringify(results))
    })
    inserir()
  }
  function inserir () {
    con.query('INSERT INTO visitas SET ?', dados, function (error, results, fields) {
      if (error) throw error
      res.end(JSON.stringify(results))
    })
  }
})

app.put('/visita/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE visitas SET dtVisita=?, descricao=?, resumo=?, contato=? WHERE idVisita=?'
  con.query(sql, [dados.dtVisita, dados.descricao, dados.resumo, dados.contato, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.get('/clienteSelectContato/:id', function (req, res) {
  var sql = 'select c.idContato, c.nmContato from contatos c, dadosClientes d where c.idCliente = d.idCliente and d.idCliente =?'
  con.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

/* *********************** AQUI INICIA OS CONTATOS ********************************** */
app.get('/contatos/', function (req, res) {
  var sql = 'select dc.idCliente, dc.nmCliente, c.* from contatos c, dadosClientes dc where c.idCliente = dc.idCliente order by c.nmContato asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.post('/contato', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO contatos SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/delContato/:id', function (req, res) {
  con.query('delete from contatos where idContato=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/contato/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE contatos SET nmContato=?, cargo=?, foneContato=?, idCliente=? WHERE idContato=?'
  con.query(sql, [dados.nmContato, dados.cargo, dados.foneContato, dados.idCliente, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

/* *********************** AQUI INICIA AS SUGESTÕES E SENHAS ********************************** */

app.get('/sugestao/', function (req, res) {
  var sql = 'select * from sugestoes order by idSugestao desc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/senhas/', function (req, res) {
  var sql = 'select * from senhasSistemas order by idSenha desc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.post('/sugestao', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO sugestoes SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.post('/cadSenhas', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO senhasSistemas SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/sugestao/:id', function (req, res) {
  var sql = "UPDATE sugestoes SET status='C' WHERE idSugestao=?"
  con.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/senhaEdit/:id', function (req, res) {
  var dados = req.body
  console.log(dados, ' - ', req.params.id)
  var sql = 'UPDATE senhasSistemas SET dsSenha=?, usSenha=?, psSenha=? where idSenha =?'
  con.query(sql, [dados.dsSenha, dados.usSenha, dados.psSenha, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/delSugestao/:id', function (req, res) {
  con.query('delete from sugestoes where idSugestao=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/delSenha/:id', function (req, res) {
  con.query('delete from senhasSistemas where idSenha=?', [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

/* *********************** AQUI INICIA AS acps ********************************** */
app.get('/acp/:id', function (req, res) {
  var dados = req.params.id.split(';')
  // var sql = 'select * from acp where idCliente=? and anoAcp =? and statusAcp = "A"'
  var sql = 'select a.idCliente, a.anoAcp, a.seqAcp, a.dtAcp, a.qtAcp, a.execAcp, a.saldo, a.totAcp, a.anotacoes, ' +
  'a.ultimaAtualizacao, a.saldoAtualTotal, a.statusAcp, a.gestorPlano, a.dtEncerramento, a.sistemas as sistemasAnt, a.chamados as chamadosAnt,  ' +
  'GROUP_CONCAT(ca.sistemas SEPARATOR ", ") as sistemas, GROUP_CONCAT(ca.chamados SEPARATOR ", ") as chamados, ca.descricaoAcp ' +
  'from acp a LEFT JOIN chamadosAcp as ca ON ca.idCliente = a.idCliente and a.anoAcp = ca.anoAcp ' +
  'and ca.seqAcp = a.seqAcp where a.idCliente=? and a.anoAcp =? GROUP by a.idCliente, a.anoAcp, a.seqAcp'
  con.query(sql, [dados[0], dados[1]], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/acpVisualizaMes/:id', function (req, res) {
  var dados = req.params.id.split(';')
  // var sql = 'select * from acp where idCliente=? and anoAcp =? and statusAcp = "A"'

  var sql = 'select a.dtAcp, ca.sistemas, ca.chamados, ca.descricaoAcp ' +
            'from acp a ' +
            'LEFT JOIN chamadosAcp as ca ON ca.idCliente = a.idCliente and a.anoAcp = ca.anoAcp ' +
            'and ca.seqAcp = a.seqAcp ' +
            'where a.idCliente=? and a.seqAcp =? and a.anoAcp=? and a.statusAcp = "A" ' +
            'AND ca.chamados != "NULL"'

  con.query(sql, [dados[0], dados[1], dados[2]], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.delete('/removeChamadoAcp/:id', function (req, res) {
  var dados = req.params.id.split(';')
  var exec = parseInt(dados[3] - 1)
  var novoSaldo = parseInt(dados[5] - exec)
  var sql = 'UPDATE acp SET execAcp=?, saldo=? where idCliente=? and anoAcp=? and seqAcp=?'
  con.query(sql, [exec, novoSaldo, dados[4], dados[1], dados[2]], function (error, results, fields) {
    if (error) throw error
  })
  con.query('delete from chamadosAcp where chamados=?', [dados[0]], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/atualizaChamado/', function (req, res) {
  var dados = req.body
  var sql = 'update chamadosAcp set sistemas=?, chamados=?, descricaoAcp=? where idCliente=? and anoAcp=? and seqAcp=? and chamados=?'
  con.query(sql, [dados.sistemas, dados.chamados, dados.descricaoAcp, dados.idCliente, dados.anoAcp, dados.seqAcp, dados.chamadoAnt], function (err, results, field) {
    if (err) {
      console.log(err.stack)
    }
    res.send(results)
  })
})

app.get('/carregaPlanosCliente/:id', function (req, res) {
  var dados = req.params.id.split(';')
  if (dados[1] === 'i') {
    var sql = 'select anoAcp from acp where idCliente =' + dados[0] + ' and seqAcp="1" and statusACp = "I" order by anoAcp desc'
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err.stack)
      }
      res.send(result)
    })
  } else {
    var sql2 = 'select anoAcp from acp where idCliente =' + dados[0] + ' and seqAcp="1" and statusACp = "A" order by anoAcp desc'
    con.query(sql2, function (err, result) {
      if (err) {
        console.log(err.stack)
      }
      res.send(result)
    })
  }
})

app.post('/cadPlano', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO acp VALUES ?', [dados], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.post('/cadChamado', function (req, res) {
  var dados = req.body
  var sql = 'INSERT INTO `chamadosAcp`(`idCliente`, `anoAcp`, `seqAcp`, `sistemas`, `chamados`, `descricaoAcp`) VALUES (?,?,?,?,?,?)'
  con.query(sql, [dados.idCliente, dados.anoAcp, dados.seqAcp, dados.sistemas, dados.chamados, dados.descricaoAcp], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/acp/:id', function (req, res) {
  var dados = req.body
  var novoSaldo = dados.qtAcp - dados.execAcp
  var sql = 'UPDATE acp SET execAcp=?, sistemas=?, chamados=?, saldo=? where idCliente=? and anoAcp=? and seqAcp=?'
  con.query(sql, [dados.execAcp, dados.sistemas, dados.chamados, novoSaldo, req.params.id, dados.anoAcp, dados.seqAcp], function (error, results, fields) {
    if (error) {
      console.log(error.stack)
    }
    res.end(JSON.stringify(results))
  })

  // ATUALIZA APENAS A HORA DA ULTIMA ATUALIZAÇÃO NO PRIMEIRO REGISTRO DO PLANO
  var sql2 = 'UPDATE acp SET ultimaAtualizacao=? where idCliente=? and anoAcp=? and seqAcp=1'
  con.query(sql2, [dados.ultimaAtualizacao, req.params.id, dados.anoAcp], function (error, results, fields) {
    if (error) {
      console.log(error.stack)
    }
  })
})

app.put('/personalizaAcp/:id', function (req, res) {
  var dados = req.body
  var novoSaldo = dados.qtAcp - dados.execAcp
  var sql = 'UPDATE acp SET qtAcp=?, saldo=? where idCliente=? and anoAcp=? and seqAcp=?'
  con.query(sql, [dados.qtAcp, novoSaldo, req.params.id, dados.anoAcp, dados.seqAcp], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/acpSistema/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE acp SET sistemas=? where idCliente=? and anoAcp=? and seqAcp=?'
  con.query(sql, [dados.sistemas, req.params.id, dados.anoAcp, dados.seqAcp], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/acpChamado/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE acp SET chamados=? where idCliente=? and anoAcp=? and seqAcp=?'
  con.query(sql, [dados.chamados, req.params.id, dados.anoAcp, dados.seqAcp], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/excluirPlano/:id', function (req, res) {
  var dados = req.params.id.split(';')
  con.query('delete from chamadosAcp where idCliente=? and anoAcp=?', [dados[0], dados[1]], function (error, results, fields) {
    res.end(JSON.stringify(results))
    if (error) throw error
  })
  con.query('delete from acp where idCliente=? and anoAcp=?', [dados[0], dados[1]], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/anotacao/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE acp SET anotacoes=? where idCliente=? and anoAcp=? and seqAcp=1'
  con.query(sql, [dados.anotacoes, req.params.id, dados.anoAcp], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.get('/saldoGeral/', function (req, res) {
  var sql = 'select d.nmCliente, a.anoAcp, a.dtEncerramento, a.saldoAtualTotal from dadosClientes d, acp a where d.idCliente = a.idCliente and a.seqAcp=1 and a.statusAcp = "A" order by d.nmCliente asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.put('/atualizaSaldoGeral/:id', function (req, res) {
  var dados = req.body
  var id = req.params.id.split(';')
  var sql2 = 'UPDATE acp SET saldoAtualTotal=? where idCliente=? and anoAcp=? and seqAcp=1 and statusAcp = "A"'
  con.query(sql2, [dados.saldoAtualTotal, id[0], id[1]], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.put('/desativarPlano/:id', function (req, res) {
  var id = req.params.id.split(';')
  var sql2 = 'UPDATE acp SET statusAcp="I" where idCliente=? and anoAcp=?'
  con.query(sql2, [id[0], id[1]], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

/* ************** NESSA PARTE ELE TESTA OS SISTEMAS WEBS OFFLINE ******************* */
app.get('/ping/:id', function (req, res) {
  var url = ''
  var data = []
  var x, y = ''
  var sql = 'select idCliente, nmCliente,' + req.params.id + ' from dadosClientes where ' + req.params.id + ' <> "" order by nmCliente'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    for (const i in result) {
      switch (req.params.id) {
        case 'endTransparencia':
          url = result[i].endTransparencia
          break
        case 'endDeiss':
          url = result[i].endDeiss
          break
        case 'endNfse':
          url = result[i].endNfse
          break
        case 'endCidadao':
          url = result[i].endCidadao
          break
        default:
          break
      }
      axios.get(url)
        .then(response => {
        // console.log(response.data.window.document.querySelector("p").textContent); // "Hello world"
          if (req.params.id === 'endTransparencia') {
            request(result[i].endTransparencia, function (err, res, body) {
              if (err) {
                data.push({ 'id': result[i].idCliente, 'dtatualizacao': 'Dado indisponível', 'nrversao': 'Dado indisponível', 'cliente': result[i].nmCliente, 'status': 'OFF-LINE' })
                console.log(err)
              } else {
                const $ = cheerio.load(body)
                x = $('.Class_RelatorioPaginaPrincipal').text().substring(23, 39)
                y = $('.Class_Relatorio').text().substring(48, 60)
                data.push({ 'id': result[i].idCliente, 'dtatualizacao': x, 'nrversao': y, 'cliente': result[i].nmCliente, 'status': 'OK' })
              }
            })
          } else {
            data.push({ 'id': result[i].idCliente, 'cliente': result[i].nmCliente, 'status': 'OK' })
          }
        })
        .catch(error => {
          console.log('Erro: ', error, ' - ', result[i].nmCliente)
          data.push({ 'id': result[i].idCliente, 'cliente': result[i].nmCliente, 'status': 'OFF-LINE' })
        })
    }
    setTimeout(() => {
      mostraResultado()
    }, 29000)
    function mostraResultado () {
      res.send(data)
      data = []
    }
  })
})

/* ************** NESSA PARTE SALVA OS SCRIPTS ******************* */
app.get('/scripts/:id', function (req, res) {
  var sql = 'select * from scripts where idUser =? order by tituloScript asc'
  con.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/selectuserscript/', function (req, res) {
  var sql = 'select distinct iduser from scripts order by iduser asc'
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.get('/scriptsSeleciona/:id', function (req, res) {
  var sql = 'select * from scripts where idScript =?'
  con.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err.stack)
    }
    res.send(result)
  })
})

app.post('/scripts', function (req, res) {
  var dados = req.body
  con.query('INSERT INTO scripts SET ?', dados, function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})
app.put('/alteraScript/:id', function (req, res) {
  var dados = req.body
  var sql = 'UPDATE scripts set tituloScript =?, dsScript =? WHERE idScript = ?'
  con.query(sql, [dados.tituloScript, dados.dsScript, req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

app.delete('/delScript/:id', function (req, res) {
  var sql = 'delete from scripts where idScript = ?'
  con.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error
    res.end(JSON.stringify(results))
  })
})

// --------------------------- LISTAGEM DO FTP ---------------------- //

app.post('/ftp', function (req, res) {
  var dados = req.body
  console.log(dados)
  const ftp = require('basic-ftp')

  listaFtp()
  async function listaFtp () {
    var result = []
    const client = new ftp.Client()
    client.ftp.verbose = true
    var list = []
    try {
      await client.access({
        host: 'ftppoa.govbr.com.br',
        user: dados.nome,
        password: dados.senha,
        secure: false
      })
      await client.ensureDir('/backup')
      list = await client.list()
    } catch (err) {
      console.log(err)
    }
    list.forEach(element => {
      if (element.size >= 1073741824) { element.size = (element.size / 1073741824).toFixed(2) + ' GB' } else if (element.size >= 1048576) { element.size = (element.size / 1048576).toFixed(2) + ' MB' } else if (element.size >= 1024) { element.size = (element.size / 1024).toFixed(2) + ' KB' } else if (element.size > 1) { element.size = element.size + ' bytes' } else if (element.size === 1) { element.size = element.size + ' byte' } else { element.size = '0 bytes' }
      /*
      console.log('Nome: ' + element.name)
      console.log('Tamanho: ' + element.size)
      console.log('Data ' + element.rawModifiedAt.substring(3, 5) + '/' + element.rawModifiedAt.substring(0, 2) + '/' + element.rawModifiedAt.substring(6, 8))
      console.log('-------------------------')
      */
      result.push({ 'nome': element.name, 'tamanho': element.size, 'dt': element.rawModifiedAt.substring(3, 5) + '/' + element.rawModifiedAt.substring(0, 2) + '/' + element.rawModifiedAt.substring(6, 8) })
    })
    client.close()
    res.send(result)
  }
})

// ------------FIM
app.listen(port, () => {
  console.log('\nServidor rodando na porta: ' + port)
})
