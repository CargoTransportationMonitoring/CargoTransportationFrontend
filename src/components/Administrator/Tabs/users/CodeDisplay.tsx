import React, {useState} from "react";
import styles from './CodeDisplay.module.css'
import { Copy, Check } from "lucide-react";

const CodeDisplay: React.FC<{
    generatedCode: String
}> = ({generatedCode}) => {

    const [copied, setCopied] = useState(false);

    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(String(generatedCode)).then((): void => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Сбрасываем через 1.5 секунды
        });
    };

    return (
        generatedCode && (
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Ваш сгенерированный код</h2>
                <div className={styles.container}>
                    <pre className={styles.code}>{generatedCode}</pre>
                    <button className={styles.copyButton} onClick={copyToClipboard}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        )
    );
};

export default CodeDisplay;
