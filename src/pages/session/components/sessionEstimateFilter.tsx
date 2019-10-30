import { EstimateFilter } from "../../../model/estimateFilter";
import React from "react";

interface ISessionEstimateFilter {
    estimateFilter: EstimateFilter;
}

export class SessionEstimateFilter extends React.Component<ISessionEstimateFilter> {


    constructor(props: any){
        super(props);
    }

    estimateFilter: EstimateFilter = EstimateFilter.All;

    render(): JSX.Element {
        const {
            updateFilter
        } = this.props;

        return (
            <div className="work-item-list-filter flex-grow flex-center">
                <input type="range" 
                        list="estimate-filter-values" 
                        value={this.props.estimateFilter}
                        onInput={
                            (() => {
                                this.props.updateFilter(
                                    this.estimateFilter
                                );
                            })
                }/>

                <datalist id="estimate-filter-values">
                    <option value="0" label="No Est."></option>
                    <option value="1" label="All"></option>
                    <option value="2" label="Estimated"></option>
                </datalist>
            </div>
        )
    }
}