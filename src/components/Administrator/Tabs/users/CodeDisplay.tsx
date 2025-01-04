import React from "react";
import styles from './CodeDisplay.module.css'

const CodeDisplay: React.FC<{
    generatedCode: String
}> = ({generatedCode}) => {
    const copyToClipboard = (): void => {
        const textArea: any = document.createElement("textarea");
        textArea.value = generatedCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    };

    return (
        <>
            {generatedCode && (
                <>
                    <h2>Ваш сгенерированный код</h2>
                    <div className={styles.codeContainer}>
                        <pre>{generatedCode}</pre>
                    </div>
                    <button onClick={copyToClipboard}>Копировать код</button>
                </>
            )}
        </>
    );
};

export default CodeDisplay;
