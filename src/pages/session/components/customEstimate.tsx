import * as React from "react";
import { TextField } from "azure-devops-ui/TextField";
import { Button } from "azure-devops-ui/Button";

export const CustomEstimate: React.FC<{
    commitEstimate: (value: string) => void;
}> = props => {
    const [value, setValue]: [any, any] = React.useState();

    return (
        <div className="flex-row">
            <TextField
                value={value}
                onChange={(
                    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                    value: string
                ) => {
                    setValue(value);
                }}
            />
            <Button
                onClick={() => {
                    props.commitEstimate(value);
                }}
            >
                Save
            </Button>
        </div>
    );
};
