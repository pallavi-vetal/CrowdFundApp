import React, { Component } from 'react';
import { Button, Input, Table } from 'semantic-ui-react'
import { createContract } from './../ethereum/crowdfundingContract'
import { web3 } from './../ethereum/web3'
import { Icon, Menu, Label } from 'semantic-ui-react'
export class Campaign extends Component {

  ONGOING_STATE = '0'
  FAILED_STATE = '1'
  SUCCEEDED_STATE = '2'
  PAID_OUT_STATE = '3'

  state = {
    campaign: {
      name: 'N/A',
      targetAmount: 0,
      totalCollected: 0,
      campaignFinished: false,
      deadline: new Date(0),
      isBeneficiary: false,
      state: '',
      tableData: [],

    },

    contributionAmount: '0'
  }

  constructor(props) {
    super(props)

    this.onContribute = this.onContribute.bind(this)
    this.onCollectFunds = this.onCollectFunds.bind(this)
  }

  async componentDidMount() {
    //console.log("this.props.match.params.address",)
    const currentCampaign = await this.getCampaign(this.getCampaignAddress())
    this.setState({
      campaign: currentCampaign
    })
  }
  async componentWillMount() {
    //console.log("this.props.match.params.address",)
    const currentCampaign = await this.getCampaign(this.getCampaignAddress())
    this.setState({
      campaign: currentCampaign
    })
  }

  getCampaignAddress() {
    return this.props.match.params.address
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
    const accounts = await web3.eth.getAccounts()
    var tableData = [];
    for (var i = 0; i < contributorsList.length; i++) {
      var myobj = {
        "name": contributorsList[i],
        "amount": amountList[i]
      }
      tableData.push(myobj);
    }

    var campaignFinished = false;
    if (totalCollected.toString() >= targetAmount.toString()) {
      console.log("campaignFinished = true;")
      campaignFinished = true;
      // await contract.methods.finishCrowdFundingBeforeDeadLine().call()

    }

    const state = await contract.methods.state().call()
    console.log("state:", state)
    console.log(parseInt(totalCollected) >= parseInt(targetAmount));
    return {
      name: name,
      targetAmount: targetAmount,
      totalCollected: totalCollected,
      campaignFinished: campaignFinished,
      deadline: deadlineDate,
      isBeneficiary: beneficiary === accounts[0],
      state: state,
      contributorsList: contributorsList,
      amountList: amountList,
      tableData: tableData
    }

  }

  render() {
    return (
      <div>
        <Table celled padded color="teal" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>

            <Table.Row>
              <Table.Cell singleLine>
                Name
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.name}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Target amount
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.targetAmount}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Total collected
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.totalCollected}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Has finished
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.campaignFinished.toString()}
              </Table.Cell>
            </Table.Row>


            <Table.Row>
              <Table.Cell singleLine>
                Deadline
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.deadline.toString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                I am beneficiary
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.isBeneficiary.toString()}
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell singleLine>
                Contract state
              </Table.Cell>
              <Table.Cell singleLine>
                {this.state.campaign.state}
              </Table.Cell>
            </Table.Row>

          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                {this.campaignInteractionSection()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <hr />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Campaign Name</Table.HeaderCell>
              <Table.HeaderCell>Name of Contributor</Table.HeaderCell>
              <Table.HeaderCell>Total Amount Contributed</Table.HeaderCell>

            </Table.Row>
          </Table.Header>

          <Table.Body>

            {this.state.campaign.tableData.map(index => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon name='linkify'>{this.state.campaign.name}</Label>
                </Table.Cell>
                <Table.Cell>{index.name}</Table.Cell>
                <Table.Cell>{index.amount}</Table.Cell>

              </Table.Row>
            ))}

          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
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

  campaignInteractionSection() {
    if (this.state.campaign.campaignFinished) {
      return this.postCampaignInterface()
    } else {
      return this.contributeInterface()
    }
  }

  postCampaignInterface() {

    //console.log("this:",this.SUCCEEDED_STATE.toString())
    // console.log(this.state.campaign.state.toString()=== this.SUCCEEDED_STATE.toString())
    if (this.state.campaign.state.toString() === this.SUCCEEDED_STATE.toString()
      && this.state.campaign.isBeneficiary === true) {

      return <div>
        <Button type='submit' positive onClick={this.onCollectFunds}>Collect funds</Button>
      </div>
    }
    if (this.state.campaign.state.toString() === this.SUCCEEDED_STATE.toString()) {
      return <div>
        <Button type='submit' positive>Campaign Finished!!</Button>
      </div>
    }
    //console.log(this.state.campaign.state.toString()=== this.SUCCEEDED_STATE.toString())


    if (this.state.campaign.state.toString() === this.FAILED_STATE) {
      return <div>
        <Button type='submit' negative>Refund</Button>
      </div>
    }
    if (this.state.campaign.state.toString() === this.PAID_OUT_STATE) {
      return <div>
        <Button type='submit' primary>Campaign Finished and Funds Collected</Button>
      </div>
    }
  }

  contributeInterface() {
    return <div>
      <Input
        action={{
          color: 'teal',
          content: 'Contribute',
          onClick: this.onContribute
        }}
        actionPosition='left'
        label='ETH'
        labelPosition='right'
        placeholder='1'
        onChange={(e) => this.setState({ contributionAmount: e.target.value })}
      />
    </div>
  }
  async onCollectFunds(event) {
    const accounts = await web3.eth.getAccounts()


    const contract = createContract(this.getCampaignAddress())
    const getTotalCollected = await contract.methods.getTotalCollected().call()
    console.log(getTotalCollected, "getTotalCollected")
    await contract.methods.collect().send({
      from: accounts[0]
    })
    const campaign = this.state.campaign
    campaign.totalCollected = Number.parseInt(campaign.totalCollected)
    campaign.contributorsList = await contract.methods.getContributors().call()
    campaign.amountList = await contract.methods.getAmountsList().call()
    campaign.beforeDeadline = await contract.methods.beforeDeadline().call()

    console.log(campaign.state)
    var tableData = [];
    for (var i = 0; i < campaign.contributorsList.length; i++) {
      var myobj = {
        "name": campaign.contributorsList[i],
        "amount": campaign.amountList[i]
      }

      tableData.push(myobj);
    }

    campaign.campaignFinished = true;
    //await contract.methods.finishCrowdFundingBeforeDeadLine()



    campaign.tableData = tableData;
    campaign.state = await contract.methods.state().call()

    console.log(campaign.state)
    this.setState({ campaign: campaign })
  }
  async onContribute(event) {

    const accounts = await web3.eth.getAccounts()

    const amount = web3.utils.toWei(
      this.state.contributionAmount,
      'ether'
    )
    const contract = createContract(this.getCampaignAddress())

    await contract.methods.contribute().send({
      from: accounts[0],
      value: amount
    })

    const campaign = this.state.campaign
    campaign.totalCollected = Number.parseInt(campaign.totalCollected) + Number.parseInt(amount)
    campaign.contributorsList = await contract.methods.getContributors().call()
    campaign.amountList = await contract.methods.getAmountsList().call()
    campaign.beforeDeadline = await contract.methods.beforeDeadline().call()

    console.log(campaign.state)
    var tableData = [];
    for (var i = 0; i < campaign.contributorsList.length; i++) {
      var myobj = {
        "name": campaign.contributorsList[i],
        "amount": campaign.amountList[i]
      }

      tableData.push(myobj);
    }
    console.log(campaign.totalCollected)
    if (campaign.totalCollected >= campaign.targetAmount) {
      campaign.campaignFinished = true;
      await contract.methods.finishCrowdFundingBeforeDeadLine()


    }
    campaign.tableData = tableData;
    campaign.state = await contract.methods.state().call()

    console.log(campaign.state)
    this.setState({ campaign: campaign })
    //await contract.methods.finishCrowdFunding().call()
  }

}