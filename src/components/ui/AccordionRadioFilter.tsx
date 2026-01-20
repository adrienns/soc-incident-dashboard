import { Accordion, AccordionItem, RadioGroup, Radio, Card, CardBody } from "@heroui/react";

interface AccordionRadioFilterProps {
    title: string;
    value: string | null;
    options: readonly string[];
    onChange: (value: string | null) => void;
}

const accordionItemClasses = {
    title: "text-xs font-semibold text-default-500 uppercase tracking-wider",
    trigger: "px-4 py-3 data-[hover=true]:bg-default-100/50 rounded-lg",
    indicator: "text-default-400",
    content: "px-4 pb-4 pt-0",
};

export const AccordionRadioFilter = ({
    title,
    value,
    options,
    onChange,
}: AccordionRadioFilterProps) => {
    return (
        <Card className="bg-content2/50 border border-default-100 shadow-sm px-0 py-0" shadow="sm">
            <CardBody className="p-0">
                <Accordion isCompact showDivider={false} defaultExpandedKeys={[title.toLowerCase()]}>
                    <AccordionItem
                        key={title.toLowerCase()}
                        aria-label={title}
                        title={title}
                        classNames={accordionItemClasses}
                    >
                        <RadioGroup
                            value={value || ''}
                            onValueChange={(val) => onChange(val || null)}
                            size="sm"
                            color="primary"
                        >
                            {options.map((option) => (
                                <Radio
                                    key={option}
                                    value={option}
                                    classNames={{ label: "text-small text-default-500 pl-2" }}
                                >
                                    {option}
                                </Radio>
                            ))}
                        </RadioGroup>
                    </AccordionItem>
                </Accordion>
            </CardBody>
        </Card>
    );
};
