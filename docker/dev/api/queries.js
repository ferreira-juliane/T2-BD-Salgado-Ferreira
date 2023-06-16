const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'boca-db',
  database: 'bocadb',
  password: 'superpass',
  port: 5432,
}); // Configurando o cliente da API para se conectar ao postgres

const getByTag = async (req, res) => {

  try {
    let contest = await pool.query(`SELECT contestnumber FROM contesttable WHERE EXISTS (SELECT contestnumber FROM contesttable WHERE contestnumber = ${req.params.contestId})`);
    if(contest.rowCount == 0){
      res.status(404).send("Not Found: O ID da competição ou da entidade especificado na requisição não existe.");
    }

    else {
      const {contestId, entityType, entityId} = req.params;

      // Checa se o entityType é valido
      if (!["problem", "language", "site", "site/user"].includes(entityType)) {
        res.status(400).send("Bad Request: Pelo menos um dos parâmetros fornecidos na requisição é inválido");
      }

      else {
        let tables = {
          table: "",
          type: ""
        };
  
        contest = null;
        switch (entityType) {
          case "problem":
            tables.table = "problemtable";
            contest = await pool.query(`SELECT problemnumber FROM problemtable WHERE EXISTS (SELECT problemnumber FROM problemtable WHERE problemnumber = ${entityId})`);
            tables.type = `AND problemnumber = ${entityId}`;
            break;
          case "language":
            tables.table = "langtable"
            contest = await pool.query(`SELECT langnumber FROM langtable WHERE EXISTS (SELECT langnumber FROM langtable WHERE langnumber = ${entityId})`);
            tables.type = `AND langnumber = ${entityId}`;
            break;
          case "site":
            tables.table = "sitetable"
            contest = await pool.query(`SELECT sitenumber FROM sitetable WHERE EXISTS (SELECT sitenumber FROM sitetable WHERE sitenumber = ${entityId})`);
            tables.type = `AND sitenumber = ${entityId}`;
            break;
          case "site/user":
            tables.table = "usertable"
            contest = await pool.query(`SELECT usersitenumber FROM usertable WHERE EXISTS (SELECT usersitenumber FROM usertable WHERE usersitenumber = ${entityId})`);
            tables.type = `AND usersitenumber = ${entityId}`;
            break;
        }

        if(contest.rowCount == 0){
          res.status(404).send("Not Found: O ID da competição ou da entidade especificado na requisição não existe.");
        }

        else {
          const tagId = req.query.tagId
          const tagName = req.query.tagName
          const tagValue = req.query.tagValue
          
          let query = (`SELECT * FROM ${tables.table} NATURAL JOIN tagstable WHERE contestnumber = ${contestId} ${tables.type}`);

          if(tagId) {query = query + ` AND tagid = ${tagId}`};
          if(tagName) {query = query + ` AND tagname = '${tagName}'`};
          if(tagValue) {query = query + ` AND tagvalue = '${tagValue}'`};

          const result = await pool.query(query);
          res.status(200).send(result.rows);
        }
      }
    }
  } catch (error) {
    res.status(500).send('Não foi possível acessar o banco de dados, verifique a sua rota.');
  }
}

/*   try {
    const {contestId, entityType, entityId} = req.params;

    // Checa se o entityType é valido
    if (!["problem", "language", "site", "site/user"].includes(entityType)) {
      res.status(400).send("Bad Request: Pelo menos um dos parâmetros fornecidos na requisição é inválido");
    }
    
    let tables = {
      table: "",
      type: ""
    };
    
    switch (entityType) {
      case "problem":
        tables.table = "problemtable";
        tables.type = `AND problemnumber = ${entityId}`;
        break;
      case "language":
        tables.table = "langtable"
        tables.type = `AND langnumber = ${entityId}`;
        break;
      case "site":
        tables.table = "sitetable"
        tables.type = `AND sitenumber = ${entityId}`;
        break;
      case "site/user":
        tables.table = "usertable"
        tables.type = `AND usersitenumber = ${entityId}`;
        break;
    }
    
    const tagId = req.query.tagId
    const tagName = req.query.tagName
    const tagValue = req.query.tagValue

    
    let query = (`SELECT * FROM ${tables.table} NATURAL JOIN tagstable WHERE contestnumber = ${contestId} ${tables.type}`);

    if(tagId) {query = query + ` AND tagid = ${tagId}`};
    if(tagName) {query = query + ` AND tagname = '${tagName}'`};
    if(tagValue) {query = query + ` AND tagvalue = '${tagValue}'`};

    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Não foi possível acessar o banco de dados, verifique a sua rota.');
  }
  */

module.exports = {
  getByTag
}