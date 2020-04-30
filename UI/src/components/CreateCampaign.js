import { createContract } from './../ethereum/crowdfundingContract'
import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { createContractCampaign } from './../ethereum/campaignContract'
import { web3 } from './../ethereum/web3'
class CreateCampaign extends Component {
    constructor(props) {
        super(props);
    
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
      }
    state = {
       
            name: 'N/A',
            targetAmount: 0,
            totalCollected: 0,
            campaignFinished: false,
            deadline: '0',
            isBeneficiary: false,
            state: '',
            amountList: [],
            contributorsList: [],
            address: '0'
      
    }
    render() {
        return (<div>
            <h1>Create Campaign</h1>
            <Form>
                <Form.Field>
                    <label>Campaign Name</label>
                    <input value='Campaign Name' onChange={this.onChange} value={this.state.name} name="name"/>
                </Form.Field>
                <Form.Field>
                    <label>Targeted Amount</label>
                    <input placeholder='Amount to collect' value={this.state.targetAmount} onChange={this.onChange} name="targetAmount"/>
                </Form.Field>
                <Form.Field>
                    <label>Duration in minutes</label>
                    <input placeholder='Deadline of campaign' value={this.state.deadline} onChange={this.onChange} name="deadline"/>
                </Form.Field>
                <Form.Field>
                    <label>Account Address</label>
                    <input placeholder='Account Address' value={this.state.address} onChange={this.onChange} name="address"/>
                </Form.Field>
                
                <Button type='submit' onClick={this.onSubmit}>Submit</Button>
            </Form>
        </div>);
    }
    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
        
      }
    
      onSubmit(event) {
        event.preventDefault();
        this.createContract();
      }
      async createContract(){
        const name = this.state.name;
        const targetAmount = this.state.targetAmount;
        const deadline = this.state.deadline;
        const address = this.state.address; 
        const accounts = await web3.eth.getAccounts()
        const addres = '0x9B10a5ae1A40f01eCb24057590bF7D04896ed06B'
        const contract = await createContractCampaign(addres);
        contract.methods.createCampaign(name,targetAmount,deadline,address)
                        .send({
                            from:accounts[0]
                           
                        }).then((res)=>{
                            const campaignInfo = res.events.CampaignStarted.returnValues;
                            
                            campaignInfo.contract = createContract(campaignInfo.address);
                            console.log(campaignInfo.name,campaignInfo.targetAmount,campaignInfo.address,campaignInfo.deadline)
                        });
        
      }
}

export default CreateCampaign;