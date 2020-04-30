import React, { Component } from 'react';
import { Button, Header, Form } from 'semantic-ui-react'
import { withRouter } from 'react-router';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import { createContract } from './../ethereum/crowdfundingContract'
import { createContractCampaign } from './../ethereum/campaignContract'
import { web3 } from './../ethereum/web3'
export class Home extends Component {

  state = {
    address: '',
    existingCampaignAddrs: [],
    campaign: {
      name: 'N/A',
      targetAmount: 0,
      totalCollected: 0,
      campaignFinished: false,
      deadline: new Date(0),
      isBeneficiary: false,
      state: '',
      amountList: [],
      contributorsList: [],
      address: ''

    },
    campaignDetails: [],
    contributionAmount: '0'
    
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitTable = this.onSubmitTable.bind(this)
   
  }
  async componentWillMount() {
    //console.log("this.props.match.params.address",)
    var tableData = [];
    const addres = '0x9B10a5ae1A40f01eCb24057590bF7D04896ed06B'
    const contract = await createContractCampaign(addres);
    var existingCampaignAddrs = []
    await contract.methods.returnAllCampaigns().call().then((campaigns) => {
      if(campaigns){
        campaigns.forEach(async(contract) => {

          existingCampaignAddrs.push(contract);
          const currentCampaign =  await this.getCampaign(contract);
          tableData.push(currentCampaign);

      })
      }
     
     
    });
   
    this.setState({
      campaignDetails: tableData,
      existingCampaignAddrs: existingCampaignAddrs
    });
    console.log("tableData", this.state.campaignDetails)

  }


 
  async getCampaign(address) {
    const contract = createContract(address)

    const name = await contract.methods.name().call()
    const targetAmount = await contract.methods.targetAmount().call()
    const totalCollected = await contract.methods.totalCollected().call()
    //const beforeDeadline = await contract.methods.beforeDeadline().call()
    const beneficiary = await contract.methods.beneficiary().call()
    const deadlineSeconds = await contract.methods.fundingDeadline().call()

    const contributorsList = await contract.methods.getContributors().call()
    const amountList = await contract.methods.getAmountsList().call()
    var deadlineDate = new Date(0);
    deadlineDate.setUTCSeconds(deadlineSeconds)
    console.log("Contributors", contributorsList)
    console.log("AmountList ", amountList)
    var campaignFinished = false;
    if (totalCollected >= targetAmount) {

      campaignFinished = true;
      //await contract.methods.finishCrowdFundingBeforeDeadLine().call()

    }
    const state = await contract.methods.state().call()
    const accounts = await web3.eth.getAccounts()
    return {
      name: name,
      targetAmount: targetAmount,
      totalCollected: totalCollected,
      campaignFinished: campaignFinished,
      deadline: deadlineDate,
      isBeneficiary: beneficiary === accounts[0],
      state: state,
      amountList: amountList,
      contributorsList: contributorsList,
      address: address
    }
  }

  render() {
    return (
      <div>
       
        <Header as='h1'>Crowdfunding application</Header>
        
        <Form>
          <Form.Input
            label='Contract Address'
            type='text'
            value={this.state.address}
            onChange={this.onChange}
          />
          <Button
            type='submit'
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </Form>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Campaign Name</Table.HeaderCell>
              <Table.HeaderCell>Target Amount</Table.HeaderCell>
              <Table.HeaderCell>Total Amount Contributed</Table.HeaderCell>
              <Table.HeaderCell>Number of Contributors</Table.HeaderCell>
              <Table.HeaderCell>Account Address</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.campaignDetails.map(match => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon name='linkify'><a onClick={e => this.onSubmitTable(match.address)}>{match.name}</a></Label>
                </Table.Cell>
                <Table.Cell>{match.targetAmount}</Table.Cell>
                <Table.Cell>{match.totalCollected}</Table.Cell>
                <Table.Cell>{match.contributorsList.length}</Table.Cell>
                <Table.Cell>{match.address}</Table.Cell>
              </Table.Row>
            ))}

          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='5'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a'>2</Menu.Item>
                  <Menu.Item as='a'>3</Menu.Item>
                  <Menu.Item as='a'>4</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }

  onChange(event) {
    this.setState({ address: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.history.push(`/campaigns/${this.state.address}`)
  }
  onSubmitTable(address) {
    //event.preventDefault();
    this.props.history.push(`/campaigns/${address}`)
  }
}

export default withRouter(Home);