import { EstimateFilter } from "../../../model/estimateFilter";
import React from "react";

interface ISessionEstimateFilter {
    estimateFilter: EstimateFilter;
    updateFilter: (filter: EstimateFilter) => {}
}

export class SessionEstimateFilter extends React.Component<ISessionEstimateFilter> {


    constructor(props: any){
        super(props);
    }

    estimateFilter: EstimateFilter = EstimateFilter.All;

    updateFilter(filter: EstimateFilter) {
        this.estimateFilter = filter;
    }

    render(): JSX.Element {
        const {
            estimateFilter
        } = this.props;

        return (
            <div className="work-item-list-filter flex-grow flex-center">
                <input type="range" 
                        list="estimate-filter-values" 
                        value={this.props.estimateFilter}
                        onInput={
                            (() => {
                                this.updateFilter(
                                    estimateFilter
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