let React = require('react');
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();
let RadioButtonGroup = mui.RadioButtonGroup;
let RadioButton = mui.RadioButton;
let CardHeader = mui.CardReader;
let CardText = mui.CardText;
let CardMedia = mui.CardMedia;
let CardTitle = mui.CardTitle;
let CardActions = mui.CardActions;
let Card = mui.Card;
let Avatar = mui.Avater;
let List = mui.List;
let ListItem = mui.ListItem;
let ListDivider = mui.ListDivider;
let FlatButton = mui.FlatButton;
let Colors = mui.Styles.Colors;
let AppCanvas = mui.AppCanvas;
let Paper = mui.Paper;
let Table = mui.Table;
let TableHeader = mui.TableHeader;
let TableHeaderColumn = mui.TableHeaderColumn;
let TableRow = mui.TableRow;
let TableRowColumn = mui.TableRowColumn;
let TableBody = mui.TableBody;
let TableFooter = mui.TableFooter;
let Dialog = mui.Dialog;
let TextField = mui.TextField;

let BarChart = require("react-chartjs").Bar;

let questoes = require('./questoes');
let comp_mask = require('./competencias_mask');

let FireBase = require('firebase');
let myFireBaseRef = new FireBase('https://brilliant-heat-9005.firebaseio.com');

let queryString = require('query-string');
let uniqid = require('uniqid');

let PerfilEmpreendedor = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
  },

  modalDismiss: function(){
    this.refs.modalError.dismiss();  
  },

  setName: function(){
    this.state.nome = this.refs.nameInput.getValue();
    this.state.key  = uniqid();
     console.log(this.state); 
    this.refs.modalName.dismiss();
  },

  getInitialState: function(){
    let urlData = queryString.parse(location.search);
    return {
      msgError: "",
      nome: urlData.nome,
      key: urlData.key
    }
  },

  onFinalizeClick: function(){

    let ans = [];
    let blanks = [];
    for(var inp in document.questionario.elements){
      if(inp.match(/^questao_/)){

        if(!document.questionario.elements[inp].value){
            blanks.push(inp.replace('questao_',' '));
            continue;      
        }

        ans.push(document.questionario.elements[inp].value );
      }
    }

    if(blanks.length){
      this.setState({msgError: blanks.join()});
      this.refs.modalError.show();
      return;
    }
  
    let toDb = {
      nome: this.state.nome,
      key: this.state.key,
      ans: ans 
    }
     
    myFireBaseRef.push(toDb);
    window.scrollTo(0, 0);
    React.render(<Relatorio username={this.state.nome.toUpperCase()} ans={ans} competencias={comp_mask}/>, document.body);

  },

  render: function() {
    console.log(this.state);
    return (
      <AppCanvas>
      <Card>
      <CardMedia overlay={
        <CardTitle
          title="Perfil do Empreendedor"
          subtitle="Qual o seu perfil de empreendedor? Descubra agora mesmo."/>
      }>
        <img src="http://lorempixel.com/600/337/business/"/>
      </CardMedia>
      <Paper style={{margin: '5vw', padding: '5vw'}}>
        <H3> Apresentação </H3>
        <p> Esta ferramenta visa realizar uma análise do seu perfil empreendedor através de questionamentos, resultando em um autoconhecimento de sua vocação empreendedora, seja empregado ou dono do próprio negócio.</p>
      </Paper>

      <Paper style={{margin: '5vw', padding: '5vw'}}>
        <H3> Instruções </H3>
        <p>O principal objetivo deste questionário, é ajudá-lo a intensificar o seu autoconhecimento.  Não há respostas certas ou erradas. Mas elas, em seu conjunto apontam tendências que podem contribuir para seu aperfeiçoamento como pessoa e profissional. Ninguém é polivalente em todos os campos do conhecimento e do trabalho.</p>
        <p>Responda por isso as perguntas da forma crítica e sincera.</p>
        <p>Leia, portanto, as 55 questões e faça a escolha da opção de 1 a 5 que mais se aplica a você de acordo com os conceitos da tabela abaixo, e marque um “X” no número correspondente à pontuação escolhida, nas colunas à direita de cada uma das afirmações.</p>
<ol>
<li>Nunca</li>
<li>Raramente</li>
<li>Algumas vezes</li>
<li>Geralmente</li>
<li>Sempre</li>
</ol>
        <p>Mesmo que as afirmativas pareçam similares, elas não são réplicas uma das outras, pois procuram sempre focalizar algum aspecto diferente das demais.</p>
      </Paper>

      <Paper style={{margin: '5vw', padding: '5vw'}}>
      <H3>Questionário</H3>
      <form name={"questionario"}>
      <List>
      {
        this.props.questoes.map(function(questao, i) {
          return ([<Pergunta questao={questao} checked={i!=0}/>,
          <ListDivider/>])
        })
      }
      </List>
      <FlatButton label="Finalizar" onClick={this.onFinalizeClick}/>
      </form>
      </Paper>
      </Card>
      <Dialog 
          ref="modalError"
          title="Responda a(s) questão(ões) em branco:"
          actions={[{text: 'Ok, entendi!', onClick: this.modalDismiss}]}
          actionFocus="submit" modal={true}>
          {this.state.msgError}
      </Dialog>
      <Dialog 
          ref="modalName"
          title="Qual o seu nome?"
          actions={[{text: 'Confirmar', onClick: this.setName}]}
          actionFocus="Submit" modal={true} openImmediately={!this.state.nome}>
          <TextField ref="nameInput" hintText="Nome" />
      </Dialog>
      </AppCanvas>
    )}
});

let H3= React.createClass({
  render: function() {
    return <h3 style={{fontSize: '20px',
        lineHeight: '28px',
        paddingBottom: '22px',
        letterSpacing: 0,
        fontWeight: 500,
        boxSizing: 'border-box'}}>{this.props.children}</h3>
  }
});

let Pergunta = React.createClass({
  render: function() {
    return <ListItem 
      leftIcon={<span>{this.props.questao.id}</span>}
      disabled='true' >
        <p>{this.props.questao.pergunta}</p>
        <RadioButtonGroup name={"questao_"+this.props.questao.id}>
        {["Nunca", "Raramente", "Algumas vezes", "Geralmente", "Sempre"].map(function(label, index) {
          return <RadioButton value={index + 1} label={label}/>
        })}
        </RadioButtonGroup>
        </ListItem>
  }
});

let Relatorio = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function(){
    return {
      competencias: this.props.competencias
    }  
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
   
  },

  subTotal1: 0,
  subTotal2: 0,
  subTotal3: 0,
  chartData1: {
    labels: [],
    datasets: [
      { 
        data:[]
      }
    ]
  },

  render: function() {
    let _this = this;
    let qIndex;
    let value = 0;
    let factor = 0;
    let competencias = this.state.competencias;
    for(var m in competencias.fatMask){
      qIndex = competencias.fatMask[m];
                
      value = Math.sign(qIndex)*(this.props.ans[Math.abs(qIndex)-1].value);
                              
      factor += value;
    }
      
    factor = competencias.correcao(factor);
                
    for(var competencia in competencias.competencias){

      competencias.competencias[competencia].value = 0;
      
      for(var m in competencias.competencias[competencia].mask){
        qIndex = competencias.competencias[competencia].mask[m];
                                               
        value = Math.sign(qIndex)*(this.props.ans[Math.abs(qIndex)-1]);
                                                                 
        competencias.competencias[competencia].value += value;
      }

      competencias.competencias[competencia].value += 6;
      competencias.competencias[competencia].value -= factor;
      competencias.competencias[competencia].value *= 100/25;
    }

    return (
        <AppCanvas>
          <Card>
            <Paper style={{margin: '5vw', padding: '5vw'}}>
              <h3>TESTE DO PERFIL EMPREENDEDOR DE {this.props.username||'NOME'}</h3>
              <hr />
              <table style={{width:'50%', display:'inline-block'}}>
                <thead>
                  <tr>
                    <th>Características empreendedoras pessoais</th>
                    <th>OBITIDA</th>
                    <th>MÁXIMA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Realização</th>
                  </tr>
                  {
                    competencias.competencias.slice(0,5).map(function(data){
                      _this.subTotal1 += data.value;
                      _this.chartData1.labels.push(data.label);
                      _this.chartData1.datasets[0].data.push(data.value);
                      return (
                        <tr>
                          <td>{data.label}</td>
                          <td style={{'text-align':'center'}}>{data.value}</td>
                          <td style={{'text-align':'center'}}>100</td>
                        </tr>
                      )
                    })
                  }
                  <tr>
                    <th style={{'text-align':'left'}}>Sub Total I</th>
                    <th>{this.subTotal1}</th>
                    <th>500</th>
                  </tr>
                  <tr></tr>
                  <tr>
                    <th>Planejamento</th>
                  </tr>
                  {
                    competencias.competencias.slice(5,8).map(function(data){
                      _this.subTotal2 += data.value;
                      _this.chartData1.labels.push(data.label);
                      _this.chartData1.datasets[0].data.push(data.value);
                      return (
                        <tr>
                          <td>{data.label}</td>
                          <td style={{'text-align':'center'}}>{data.value}</td>
                          <td style={{'text-align':'center'}}>100</td>
                        </tr>
                      )
                    })
                  }
                  <tr>
                    <th style={{'text-align':'left'}}>Sub Total II</th>
                    <th>{this.subTotal2}</th>
                    <th>300</th>
                  </tr>
                  <tr></tr>
                  <tr>
                    <th>Poder</th>
                  </tr>
                  {
                    competencias.competencias.slice(8,10).map(function(data){
                      _this.subTotal3 += data.value;
                      _this.chartData1.labels.push(data.label);
                      _this.chartData1.datasets[0].data.push(data.value);
                      return (
                        <tr>
                          <td>{data.label}</td>
                          <td style={{'text-align':'center'}}>{data.value}</td>
                          <td style={{'text-align':'center'}}>100</td>
                        </tr>
                      )
                    })
                  }
                  <tr>
                    <th style={{'text-align':'left'}}>Sub Total III</th>
                    <th>{this.subTotal3}</th>
                    <th>200</th>
                  </tr>
                                                                              
                </tbody>

              </table>
              <table style={{width:'50%', float:'right', display:'inline-block'}}>
                <thead>
                  <tr>
                    <th>CARACTERÍSTICAS</th>
                    <th>OBTIDA</th>
                    <th>MÁXIMA</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Realização</td>
                    <td style={{'text-align':'center'}}>{this.subTotal1}</td>
                    <td style={{'text-align':'center'}}>500</td>
                    <td style={{'text-align':'center'}}>{Math.round(100*this.subTotal1/500)}</td>
                  </tr>
                  <tr>
                    <td style={{'text-align':'left'}}>Planejamento</td>
                    <td style={{'text-align':'center'}}>{this.subTotal2}</td>
                    <td style={{'text-align':'center'}}>300</td>
                    <td style={{'text-align':'center'}}>{Math.round(100*this.subTotal2/300)}</td>
                  </tr>
                  <tr>
                    <td style={{'text-align':'left'}}>Poder</td>
                    <td style={{'text-align':'center'}}>{this.subTotal3}</td>
                    <td style={{'text-align':'center'}}>200</td>
                    <td style={{'text-align':'center'}}>{Math.round(100*this.subTotal3/200)}</td>
                  </tr>
                  <tr>
                    <th style={{'text-align':'left'}}>Total</th>
                    <th style={{'text-align':'center'}}>{this.subTotal1+this.subTotal2+this.subTotal3}</th>
                    <th style={{'text-align':'center'}}>1000</th>
                    <th style={{'text-align':'center'}}>{Math.round(100*(this.subTotal1+this.subTotal2+this.subTotal3)/1000)}</th>
                  </tr>
                </tbody>
              </table>
            </Paper>
            <Paper style={{margin: '5vw', padding: '5vw'}}>
              <h3>GRÁFICO - PONTUAÇÃO</h3>
              <hr />
              <BarChart 
              data={this.chartData1}
              style={{width:'100%', height:600}}
              options={{
                barValueSpacing : 50,
              }} redraw/>
            </Paper>
            <Paper style={{margin: '5vw', padding: '5vw'}}>
              <h3>GRÁFICO - CARACTERÍSTICAS</h3>
              <hr />
              <BarChart
              style={{width:'100%', height:600}}
              data={{                
                  labels: ['Realização', 'Planejamento', 'Poder', 'Total'],
                  datasets: [
                    { 
                      data:[
                        this.subTotal1*100/500,

                        this.subTotal2*100/300,

                        this.subTotal3*100/200,

                        (this.subTotal1+
                        this.subTotal2+
                        this.subTotal3)*100/1000
                      ]
                    }
                  ]
             }} />
            </Paper>
          </Card>
        </AppCanvas>
    );
  }
});
React.render(<PerfilEmpreendedor questoes={questoes} />, document.body);
