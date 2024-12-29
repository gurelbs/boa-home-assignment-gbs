import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useCustomer,
  useApplyAttributeChange,
  useTranslate,
  useCartLines,
  Form,
  Spacing,
} from "@shopify/ui-extensions-react/checkout";
import { CartLine } from "@shopify/ui-extensions/checkout";
import { Button } from "@shopify/ui-extensions-react/checkout";
import { useState } from "react";

interface CheckedCartLine extends CartLine { checked: boolean }

export default reactExtension("purchase.checkout.block.render", () => (
  <SaveCartItemsForLater />
));

function SaveCartItemsForLater() {
  
  const translate = useTranslate();
  const cartLines = useCartLines();
  const customer = useCustomer();
  const [checkCartLines, setCheckCartLines] = useState<CheckedCartLine[]>(cartLines as CheckedCartLine[]);
  const [isLoading, setIsLoading] = useState(false);

  if (!customer) {
    return (
      <Banner title="Save Your Cart Items for Later" status="warning">
        {translate("userIsNotLoggedIn")}
      </Banner>
    );
  }


  async function handleSubmit() {
    setIsLoading(true);
    const checkedCartLines = checkCartLines.filter((line) => line.checked);
    console.log("checkedCartLines", checkedCartLines);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  }

  async function handleCheckboxChange(isChecked, line) {
    setCheckCartLines((prev) => {
      return prev.map((prevLine) => {
        if (prevLine.id === line.id) {
          return { ...prevLine, checked: isChecked };
        }
        return prevLine;
      });
    });
  }


  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title={`Hey ${customer.firstName}, Want to save your cart items for later?`} status="info">
        {checkCartLines.map((line,) => (
          <Checkbox key={line.merchandise.id} checked={line.checked} onChange={(isChecked) => handleCheckboxChange(isChecked, line)}
          >
            <Text appearance={line.checked ? "info" : "success"}>
              {line.merchandise.title} ({line.quantity})
            </Text>
          </Checkbox>
        ))}
        <Button 
          disabled={checkCartLines.filter((line) => line.checked).length === 0}
          accessibilityRole="button"
          onPress={handleSubmit} 
          loading={isLoading}
          >
            Save for Later
          </Button>
      </Banner>
    </BlockStack>
  );
}