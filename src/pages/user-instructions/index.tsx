import TapeInsctructions from '@/components/TapeInstructions';
import FrequentlyAskedQuestions from '@/pages/frequently-asked-questions';
import styles from '@/styles/modules/UserInstructions.module.scss';
import Head from 'next/head';

export default function UserInstructions() {
  return (
    <>
      <Head>
        <title>User instructions - QuiPtaping</title>
      </Head>
      <div className={styles.instructions}>
        <div className={`container ${styles.instructionsBlock}`}>
          <h2 className="title">Work for the best result of your painting job</h2>
          <p>
            A painting job is very labor intensive.
            Did you know that only an average 8% of the cost is material based.
          </p>
          <p>
            Everybody recognises the time and effort that is spent on preparation.
            Also the appliance of tape is such a time consuming job
            and requires some skills and practice to mask properly.
            Finally, when you remove the tape the result is not what you had in mind: straight painting lines.
          </p>
        </div>

        <TapeInsctructions />

        <div className={`container ${styles.instructionsBlock}`}>
          <div>
            <h2 className="title">Handmasker operating instructions</h2>
            <p>Tape appliance with QuiP® tape dispenser:</p>
            <ol>
              <li className={styles.instructionsListItem}>
                The tape dispenser has rubber wheels to press the tape against the surface.
              </li>
              <li className={styles.instructionsListItem}>
                Straight from the start the tape needs to be pressed by the wheels.
              </li>
              <li className={styles.instructionsListItem}>
                To start press the bottom part of the body to the surface and move towards the corner.
              </li>
              <li className={styles.instructionsListItem}>
                Place the dispenser straight against the frame or corner and move in an even pace.
              </li>
              <li className={styles.instructionsListItem}>
                Do not need to put too much pressure during appliance, otherwise the tape will “slip”.<br />
                After appliance always check if the tape sticks at the edges.
              </li>
              <li className={styles.instructionsListItem}>
                While applying the tape tilt the dispenser.
                Coming in the next corner the dispenser must be tilted completely.
              </li>
              <li className={styles.instructionsListItem}>
                When the SAFETYLOCK is pressed, the trigger will be activated.
                Pull the trigger and the tape is cut straight and accurate.
              </li>
            </ol>
          </div>

          <FrequentlyAskedQuestions isStandalone={false} />
        </div>
      </div>
    </>
  );
}
